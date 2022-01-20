import { ObjectId } from 'mongoose';

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
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  meta: {
    location: {
      city: string | null;
      address: string | null;
      country: string | null;
      zipCode: string | null,
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
  _id: string;
  __v: number;
  password: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface GetProductProps {
  _id?: string | ObjectId;
  count: number;
}