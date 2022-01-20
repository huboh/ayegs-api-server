import { Errors } from '../../utils';
import CartItem from "../models/CartItem";
import { ObjectId, isValidObjectId } from 'mongoose';

export default {
  async getCartItems(userId: string | ObjectId): Promise<any> {
    if (!isValidObjectId(userId)) throw new Errors.ResourceNotFound(
      'invalid resource idenitifier'
    );

    return CartItem.find(
      { userId }
    );
  },

  async addCartItems(productIds: string | ObjectId | (string | ObjectId)[]) {

  }
};