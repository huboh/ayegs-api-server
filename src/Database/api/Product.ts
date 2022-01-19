import { Errors } from '../../utils';
import Product from "../models/Product";
import { GetProductProps } from '../../types';
import { ObjectId, isValidObjectId } from 'mongoose';

export default {
  async getProducts(query: GetProductProps): Promise<any> {
    return Product.find();
  },

  async getProductById(_id: string | ObjectId): Promise<any> {
    if (!isValidObjectId(_id)) throw new Errors.ResourceNotFound(
      'invalid resource idenitifier'
    );

    return Product.findById(
      _id
    );
  },

  async getRecentlyAdded(count: number): Promise<any> {
    return Product.find(
      {}
    );
  },
};