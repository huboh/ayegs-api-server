import { Schema, model } from 'mongoose';
import { CartItemModel } from '../../types';

const CartItemSchema = new Schema({
  quantity: {
    type: Number, default: 1
  },
  userId: {
    type: Schema.Types.ObjectId, immutable: true, required: [true, 'you must be logged to add item(s) to cart'],
  },
  productId: {
    type: Schema.Types.ObjectId, immutable: true, required: [true, 'product id is required to add item(s) to cart'],
  }
},
  {
    timestamps: true
  }
);

const CartItem = model<CartItemModel>('CartItem', CartItemSchema);

export {
  CartItem as default
};