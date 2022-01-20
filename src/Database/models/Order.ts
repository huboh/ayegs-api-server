import { Schema, model } from 'mongoose';

const OrderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId
  },
  meta: {
    quantity: {
      type: Number, default: 1
    },
    productId: {
      type: Schema.Types.ObjectId, required: [true, 'product identified not specified']
    },
    trackingId: {
      type: String, default: ''
    },
    location: {
      city: { type: String, lowercase: true, default: '' },
      address: { type: String, lowercase: true, default: '' },
      country: { type: String, lowercase: true, default: '' },
      zipCode: { type: Number, length: 6, default: null },
    },
  }
},
  {
    timestamps: true,
  }
);

const Order = model('Order', OrderSchema);

export {
  Order as default
};