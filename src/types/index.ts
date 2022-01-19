export const enum ResponseStatus {
  success = 'success',
  error = 'error'
}

export interface SendJsonProps {
  status: 'success' | 'error';
  statusCode: number;
  message?: string;
  data?: unknown;
  errors?: unknown;
}

export interface SubmittedUser {
  name: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}


export interface User {
  name: string;
  lastName: string;
  firstName: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  email: string;
  password: string;
  phone: string;
  avatarUrl: string;
  meta: {
    location: {
      city: string;
      address: string;
      country: string;
      zipCode: string,
    },
    payment: {
      expiry: string;
      provider: string;
      accountNo: string;
      paymentType: string;
    };
  },
}