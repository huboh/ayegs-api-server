import { ObjectId } from 'mongoose';

export type UserId = Object | string;
export type ProductId = Object | string;
export type CartItemId = Object | string;

export type ResponseStatusText = 'success' | 'error';

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
  name: string | null;
  lastName: string | null;
  firstName: string | null;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  email: string | null;
  phone: string | null;
  avatarUrl: string | null;
  meta: {
    location: {
      city: string | null;
      address: string | null;
      country: string | null;
      zipCode: number | null,
    },
    payment: {
      expiry: string | null;
      provider: string | null;
      accountNo: string | null;
      paymentType: string | null;
    };
  },
}

export interface UserFromDB extends User {
  _id: UserId;
  __v: number;
  password: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

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