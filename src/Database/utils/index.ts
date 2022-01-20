import { User } from "../../types";

export const getUserFromObject = (user: Partial<User>): User => ({
  name: user.name ?? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() ?? null,
  lastName: user.lastName ?? null,
  firstName: user.firstName ?? null,
  isEmailVerified: user.isEmailVerified ?? false,
  isPhoneVerified: user.isPhoneVerified ?? false,
  email: user.email ?? null,
  phone: user.phone ?? null,
  avatarUrl: user.avatarUrl ?? null,
  meta: {
    location: {
      city: user.meta?.location?.city ?? null,
      address: user.meta?.location?.address ?? null,
      country: user.meta?.location?.country ?? null,
      zipCode: user.meta?.location?.zipCode ?? null,
    },
    payment: {
      expiry: user.meta?.payment?.expiry ?? null,
      provider: user.meta?.payment?.provider ?? null,
      accountNo: user.meta?.payment?.accountNo ?? null,
      paymentType: user.meta?.payment?.paymentType ?? null,
    }
  },
});