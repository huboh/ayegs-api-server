import { Schema, model } from 'mongoose';

const CategorySchema = new Schema({
  name: {
    type: String, lowercase: true, required: true
  },
  desc: {
    long: { type: String, lowercase: true },
    short: { type: String, lowercase: true }
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