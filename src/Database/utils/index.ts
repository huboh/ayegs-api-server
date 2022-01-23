import { User } from "../../types";

export const normalizeUser = (user: User): Partial<User> => ({
  name: user.name ?? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() ?? '',
  lastName: user.lastName ?? '',
  firstName: user.firstName ?? '',
  isEmailVerified: user.isEmailVerified ?? false,
  isPhoneVerified: user.isPhoneVerified ?? false,
  email: user.email ?? '',
  phone: user.phone ?? '',
  avatarUrl: user.avatarUrl ?? '',
  meta: {
    location: {
      city: user.meta?.location?.city ?? '',
      address: user.meta?.location?.address ?? '',
      country: user.meta?.location?.country ?? '',
      zipCode: user.meta?.location?.zipCode ?? null,
    },
    payment: {
      expiry: user.meta?.payment?.expiry ?? '',
      provider: user.meta?.payment?.provider ?? '',
      accountNo: user.meta?.payment?.accountNo ?? '',
      paymentType: user.meta?.payment?.paymentType ?? '',
    }
  },
});