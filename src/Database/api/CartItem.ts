import CartItem from "../models/CartItem";

import { Errors } from '../../utils';
import { isValidObjectId } from 'mongoose';
import { UserId, ProductId } from "../../types";

export default {
  async getCartItems(userId: UserId): Promise<unknown[]> {
    if (!isValidObjectId(userId)) throw new Errors.ValidationError(
      'validation error', ['invalid idenitifier']
    );

    return CartItem.find(
      { userId }
    );
  },

  async addCartItems(userId: UserId, productId: ProductId | ProductId[]) {
    // TODO : verify product exists, verify user id, add the item to cart

    if (!isValidObjectId(productId)) throw new Errors.ResourceNotFound(
      'error getting product', ['invalid idenitifier']
    );
  },

  async addCartItem(userId: UserId, productIds: ProductId) {

  },
};