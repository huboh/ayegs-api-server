import { Schema, model } from 'mongoose';

const CartItemSchema = new Schema({
  quantity: {
    type: Number, default: 1
  },
  userId: {
    type: Schema.Types.ObjectId, required: true, immutable: true
  },
  productId: {
    type: Schema.Types.ObjectId, required: true, immutable: true
  }
}, {
  timestamps: true
});

const CartItem = model('CartItem', CartItemSchema);

export {
  CartItem as default
};