import { Schema, model } from 'mongoose';
import { OrderModel } from '../../types';

const OrderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId, required: [true, 'user id required'], immutable: true,
  },
  status: {
    type: String, lowercase: true, default: 'processing'
  },
  productId: {
    type: Schema.Types.ObjectId, immutable: true, required: [true, 'product identifier not specified']
  },
  trackingId: {
    type: String, default: ''
  },
  meta: {
    quantity: {
      type: Number, default: 1
    },
    shippingDetails: {
      zipCode: { type: Number, length: 6, default: null },
      country: { type: String, lowercase: true, default: '' },
      city: { type: String, lowercase: true, required: [true, 'shipping address city is required'] },
      address: { type: String, lowercase: true, required: [true, 'shipping address is required'] },
    },
  }
},
  {
    timestamps: true,
  }
);

const Order = model<OrderModel>('Order', OrderSchema);

export {
  Order as default
};