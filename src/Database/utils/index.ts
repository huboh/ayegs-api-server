import { User } from "../../types";
import { Errors } from "../../utils";

export const getUserFromObject = (user: Partial<User>): User => {
  if (!user.email || !user.password) {
    throw new Errors.ValidaionError('email or password not specified');
  }

  return {
    name: `${user.firstName} ${user.lastName}`.trim(),
    lastName: user.lastName ?? '',
    firstName: user.firstName ?? '',
    isEmailVerified: user.isEmailVerified ?? false,
    isPhoneVerified: user.isPhoneVerified ?? false,
    email: user.email,
    password: user.password,
    phone: user.phone ?? '',
    avatarUrl: user.avatarUrl ?? '',
    meta: {
      location: {
        city: user.meta?.location.city ?? '',
        address: user.meta?.location.address ?? '',
        country: user.meta?.location.country ?? '',
        zipCode: user.meta?.location.zipCode ?? 0,
      },
      payment: {
        expiry: user.meta?.payment.expiry ?? '',
        provider: user.meta?.payment.provider ?? '',
        accountNo: user.meta?.payment.accountNo ?? '',
        paymentType: user.meta?.payment.paymentType ?? '',
      }
    },
  };
};