import { Schema, model } from 'mongoose';

const OrderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId
  },
  meta: {
    quantity: {
      type: Number
    },
    productId: {
      type: Schema.Types.ObjectId
    },
    trackingId: {
      type: String
    },
    location: {
      city: { type: String, lowercase: true },
      address: { type: String, lowercase: true },
      country: { type: String, lowercase: true },
      zip_code: { type: String, lowercase: true, length: 6 },
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