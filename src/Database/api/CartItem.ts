import Product from "./Product";
import CartItem from "../models/CartItem";

import { Errors, verifyMongooseIdentifiers } from '../../utils';
import { UserId, GetCartItemProp, AddCartItemProp, AddCartItemsProp, UpdateCartItemsProp, RemoveCartItemProp, CartItemExistsProp, } from "../../types";

export default {
  async cartItemsExists({ _id, productId, userId }: CartItemExistsProp) {
    verifyMongooseIdentifiers(_id, productId, userId);

    return CartItem.exists(
      { $or: [{ userId, productId }, { _id }] }
    );
  },

  async getCartItems(userId: UserId) {
    verifyMongooseIdentifiers(userId);

    const cartItems = await CartItem.find({ userId });
    const total = cartItems.length;

    return {
      total,
      cartItems,
    };
  },

  async getCartItem({ _id, userId, productId }: GetCartItemProp) {
    verifyMongooseIdentifiers(_id, userId, productId);

    return CartItem.findOne(
      { $or: [{ userId, productId }, { _id }] }
    );
  },

  async addCartItems({ userId, products }: AddCartItemsProp) {
    if (!(products instanceof Array) || ((products instanceof Array) && !products.length)) {
      throw new Errors.InvalidPayloadError('invalid request', ['payload must be an array containing cart item(s)']);
    };

    const results = await Promise.allSettled(products.map((product) => (
      this.addCartItem({ userId, ...product })
    )));

    return results.map((result) => (
      (result as any).value)
    );
  },

  async addCartItem({ userId, productId, quantity: qty }: AddCartItemProp) {
    let result = true;

    try {
      verifyMongooseIdentifiers(userId, productId);

      const quantity = isNaN(Number(qty)) ? 1 : qty;
      const [productExists, itemInCart] = await Promise.all([
        Product.productExists(productId), this.cartItemsExists({ userId, productId })
      ]);

      if (!productExists) throw new Errors.ValidationError(
        'validation error', ['error adding item to cart']
      );

      if (itemInCart) {
        await this.updateQuantity({ quantity, userId, productId });
      } else {
        await CartItem.create({ quantity, userId, productId });
      }

    } catch (error) {
      result = false;
    } finally {
      return result;
    }
  },

  async removeCartItem({ userId, productId, _id }: RemoveCartItemProp) {
    verifyMongooseIdentifiers(userId, productId, _id);

    if (!(await this.cartItemsExists({ userId, productId, _id }))) throw new Errors.ForbiddenError(
      'item does not exists in cart'
    );

    return (
      await CartItem.deleteOne({ $or: [{ userId, productId }, { _id }] })
    ).deletedCount === 1;
  },

  async updateQuantity({ _id, userId, productId, quantity: qty = 1 }: UpdateCartItemsProp) {
    verifyMongooseIdentifiers(_id, userId, productId);

    const quantity = isNaN(Number(qty)) ? 1 : qty;
    const cartItem = await this.getCartItem({ userId, productId, _id });

    if (!cartItem) throw new Errors.ResourceNotFound(
      '', ['item does not exists in cart']
    );

    return ((cartItem.quantity + quantity) < 1) ? this.removeCartItem({ userId, productId, _id }) : CartItem.findOneAndUpdate(
      { $or: [{ userId, productId }, { _id }] }, { $inc: { quantity } }, { new: true }
    );
  }
};