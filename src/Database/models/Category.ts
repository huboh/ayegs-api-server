import { Schema, model } from 'mongoose';

const CategorySchema = new Schema({
  name: {
    type: String, lowercase: true, required: [true, 'category name not specified']
  },
  desc: {
    long: { type: String, lowercase: true, default: '' },
    short: { type: String, lowercase: true, default: '' }
  },
},
  {
    timestamps: true,
  }
);

const Category = model('Category', CategorySchema);

export {
  Category as default
};