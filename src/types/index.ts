import { ObjectId } from 'mongoose';

export type UserId = ObjectId | string;
export type OrderId = ObjectId | string;
export type ProductId = ObjectId | string;
export type CartItemId = ObjectId | string;
export type CategoryId = ObjectId | string;

export type OrderStatus = 'processing' | 'shipped' | 'in transit' | 'delivered';;
export type ResponseStatusText = 'success' | 'error';

export interface MongoDBProps {
  __v: number;
  _id: string | ObjectId;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface SendJsonProps {
  status: ResponseStatusText;
  statusCode: number;
  message?: string;
  data?: unknown;
  errors?: unknown;
}

export interface SubmittedUser {
  name?: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface User {
  name: string;
  email: string;
  phone: string;
  password: string;
  avatarUrl: string;
  lastName: string;
  firstName: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  meta: {
    location: {
      city: string;
      address: string;
      country: string;
      zipCode: number,
    },
    payment: {
      expiry: string;
      provider: string;
      accountNo: string;
      paymentType: string;
    };
  },
}

export interface Product {
  title: string;
  mainImageUrl: string,
  meta: {
    categoriesId: CategoryId[];
    imagesUrl: string;
    stock: number;
    sku: string;
    price: {
      currency: string;
      current: string;
      previous: string;
    },
    desc: {
      long: string;
      short: string;
    },
    reviews: {
      average: number;
      count: number;
    },
    discount: {
      percent: number;
      active: boolean;
    };
  };
}

export interface Order {
  userId: UserId;
  status: OrderStatus;
  productId: ProductId;
  trackingId: string;
  meta: {
    quantity: number;
    shippingDetails: {
      city: string;
      zipCode: number;
      country: string;
      address: string;
    },
  };
}

export interface CartItem {
  quantity: number;
  userId: UserId;
  productId: ProductId;
}

export interface Category {
  name: string;
  desc: {
    long: string;
    short: string;
  };
}

export interface UserModel extends MongoDBProps, User { }
export interface OrderModel extends MongoDBProps, Order { }
export interface ProductModel extends MongoDBProps, Product { }
export interface CartItemModel extends MongoDBProps, CartItem { }
export interface CategoryModel extends MongoDBProps, Category { }

export interface GetProductProps {
  _id?: UserId;
  count: number;
}

export interface GetProductResponse {
  limit: number;
  total: number;
  currentPage: number;
  previousPage: number;
  products: unknown[];
}

export interface AddCartItemsProp {
  userId: UserId;
  products: Array<{
    quantity?: number;
    productId: ProductId;
  }>;
}

export interface AddCartItemProp {
  userId: UserId;
  productId: ProductId;
  quantity?: number;
}

export interface GetCartItemProp {
  userId: UserId;
  _id?: CartItemId;
  productId?: ProductId;
}

export interface UpdateCartItemsProp {
  userId: UserId;
  _id?: CartItemId;
  productId?: ProductId;
  quantity?: number;
}

export interface RemoveCartItemProp {
  userId: UserId;
  _id?: CartItemId;
  productId?: ProductId;
}

export interface CartItemExistsProp {
  userId: UserId;
  _id?: CartItemId;
  productId?: ProductId;
}

export interface CreateOrderProp {
  orderDetails: Order;
}

export interface GetOrderProp {
  userId: UserId;
  orderId: OrderId;
}

export interface UpdateOrderProp {
  userId: UserId;
  orderId: OrderId;
  newOrderDetails: Partial<Order>;
}

export interface UpdateOrderStatusProp {
  userId: UserId;
  orderId: OrderId;
  orderStatus: Order['status'];
}

export interface RemoveOrderProp {
  userId: UserId;
  orderId: OrderId;
}