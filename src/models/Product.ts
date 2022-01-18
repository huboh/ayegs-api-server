import { Schema, model } from 'mongoose';

const ProductSchema = new Schema({
  title: {
    type: String, lowercase: true
  },
  mainImageUrl: {
    type: String
  },
  meta: {
    sku: {
      type: String, lowercase: true
    },
    price: {
      currency: { type: String, lowercase: true },
      current: { type: String, lowercase: true },
      previous: { type: String, lowercase: true },
    },
    desc: {
      long: { type: String, lowercase: true },
      short: { type: String, lowercase: true }
    },
    reviews: {
      average: { type: Number },
      count: { type: Number },
    },
    categoriesId: [
      Schema.Types.ObjectId
    ],
    imagesUrl: [
      { type: String, }
    ],
    stock: {
      type: Number
    },
    discount: {
      percent: Number,
      active: Boolean
    }
  }
},
  {
    timestamps: true,
  }
);

const Product = model('Product', ProductSchema);

export {
  Product as default
};