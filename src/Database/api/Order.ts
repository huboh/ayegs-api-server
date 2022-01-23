import Product from "./Product";
import Order from "../models/Order";

import { Errors, verifyMongooseIdentifiers, mergeDeepObjects } from '../../utils';
import { UserId, OrderId, CreateOrderProp, GetOrderProp, RemoveOrderProp, UpdateOrderProp, UpdateOrderStatusProp } from "../../types";

export default {
  async orderExists(_id: OrderId) {
    verifyMongooseIdentifiers(_id);

    return Order.exists({
      _id
    });
  },

  async asserOrderExists(_id: OrderId): Promise<void | never> {
    if (!(await this.orderExists(_id))) throw new Errors.ResourceNotFound(
      '', ['order does not exists']
    );
  },

  async getOrders(userId: UserId) {
    verifyMongooseIdentifiers(userId);

    const orders = await Order.find({ userId });
    const total = orders.length;

    return {
      total,
      orderDetails: orders,
    };
  },

  async getOrder({ userId, orderId }: GetOrderProp) {
    verifyMongooseIdentifiers(userId, orderId);

    await this.asserOrderExists(orderId);
    const orderDetails = await Order.findOne({ _id: orderId });

    return {
      orderDetails
    };
  },

  async createOrder({ orderDetails }: CreateOrderProp) {
    verifyMongooseIdentifiers(orderDetails.userId);

    if (!(await Product.productExists(orderDetails.productId ?? 'null'))) throw new Errors.InvalidPayloadError(
      'Validation Error', ['product does not exists']
    );

    /**
     * TODO : create tracking functionality
     */
    const order = { ...orderDetails, status: 'processing', trackingId: '' };
    const newOrder = await Order.create({ ...order });
    const orders = await this.getOrders(order.userId);

    return {
      ...orders
    };
  },

  async removeOrder({ userId, orderId }: RemoveOrderProp) {
    verifyMongooseIdentifiers(userId, orderId);

    const deleted = (await Order.deleteOne({ _id: orderId })).deletedCount === 1;

    return {
      deleted
    };
  },

  /**
   * only updates the `meta`property on the `Order` document.
   */
  async updateOrder({ userId, orderId, newOrderDetails }: UpdateOrderProp) {
    verifyMongooseIdentifiers(userId, orderId);

    const { orderDetails } = await this.getOrder({ userId, orderId });
    const newOrderMetaData = mergeDeepObjects(orderDetails?.meta, newOrderDetails);
    const result = await Order.findByIdAndUpdate(orderId, { $set: { meta: newOrderMetaData } },
      { new: true, sanitizeFilter: true }
    );

    return {
      orderDetail: result,
    };
  },

  async updateOrderStatus({ userId, orderId, orderStatus }: UpdateOrderStatusProp) {
    verifyMongooseIdentifiers(userId, orderId);

    const result = await Order.findByIdAndUpdate(orderId, { $set: { status: orderStatus } },
      { new: true, sanitizeFilter: true }
    );

    return {
      orderDetail: result,
    };
  },
};

// const orderDetails = {
//   productId: '',
//   trackingId: '',
//   meta: {
//     quantity: 1,
//     shippingDetails: {
//       zipCode: 1000,
//       country: 'nigeria',
//       city: 'sabon tasha',
//       address: 'shipping address',
//     },
//   }
// };