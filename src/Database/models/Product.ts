import { Schema, model } from 'mongoose';
import { ProductModel } from '../../types';

const ProductSchema = new Schema({
  title: {
    type: String, lowercase: true, required: [true, 'product title not specified']
  },
  mainImageUrl: {
    type: String, required: [true, 'product main image not specified']
  },
  meta: {
    sku: {
      type: String, lowercase: true, default: ''
    },
    price: {
      currency: { type: String, lowercase: true, default: '' },
      current: { type: String, lowercase: true, required: [true, 'product price not specified'] },
      previous: { type: String, lowercase: true, default: '' },
    },
    desc: {
      long: { type: String, lowercase: true, default: '' },
      short: { type: String, lowercase: true, default: '' }
    },
    reviews: {
      average: { type: Number, default: 0.0 },
      count: { type: Number, default: 0 },
    },
    categoriesId: [
      Schema.Types.ObjectId
    ],
    imagesUrl: [
      { type: String, default: '' }
    ],
    stock: {
      type: Number, default: 0
    },
    discount: {
      percent: { type: Number, default: 0 },
      active: { type: Boolean, default: false }
    }
  }
},
  {
    timestamps: true,
  }
);

const Product = model<ProductModel>('Product', ProductSchema);

export {
  Product as default
};