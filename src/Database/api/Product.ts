import Product from "../models/Product";

import { Errors } from '../../utils';
import { GetProductResponse, ProductId } from '../../types';
import { ObjectId, isValidObjectId, FilterQuery } from 'mongoose';

const initialPage = 1;
const Querylimit = 50;

export default {
  async productExists(_id: ProductId): Promise<boolean> {
    return (_id && !isValidObjectId(_id)) ? false : Product.findOne({
      _id
    });
  },

  async getProducts(page = initialPage, limit = Querylimit, query?: FilterQuery<any>): Promise<GetProductResponse> {

    page = isNaN(Number(page)) ? 1 : page;
    limit = isNaN(Number(limit)) ? Querylimit : limit;

    const currentPage = (page <= 1) ? 1 : page;
    const previousPage = currentPage - 1;
    const skipCount = previousPage * limit;
    const products = await Product.find({ ...query }).skip(skipCount).limit(limit);
    const total = products.length;

    return {
      total,
      limit,
      currentPage,
      previousPage,
      products,
    };
  },

  async getProductById(_id: ProductId): Promise<any> {
    if (!isValidObjectId(_id)) throw new Errors.ResourceNotFound(
      'invalid resource idenitifier'
    );

    return Product.findById(
      _id
    );
  },

  async getRecentlyAdded(page = initialPage, count = Querylimit) {
    const currentMonth = (new Date(Date.now())).getMonth();
    const previousMonth = new Date((new Date(Date.now())).setMonth(currentMonth - 1)).toISOString();

    return this.getProducts(page, count, {
      createdAt: { $gte: previousMonth }
    });
  },

  async addProduct(productDetails: any) {
    return Product.create(
      productDetails
    );
  },
};