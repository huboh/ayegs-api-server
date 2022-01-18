import validator from 'validator';
import { passwords } from '../utils';
import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  name: {
    type: String, lowercase: true
  },
  avatarUrl: {
    type: String, lowercase: true
  },
  lastName: {
    type: String, lowercase: true
  },
  firstName: {
    type: String, lowercase: true
  },
  isEmailVerified: {
    type: Boolean, default: false
  },
  isPhoneVerified: {
    type: Boolean, default: false
  },
  password: {
    type: String, required: [true, 'password is required'], minlength: [6, 'minimum password lenght is 6'],
  },
  email: {
    type: String, unique: true, required: [true, 'email address is required'], lowercase: true, validate: [
      validator.isEmail, 'invalid email address'
    ]
  },
  phone: {
    type: String, unique: true, lowercase: true, validate: [
      validator.isMobilePhone, 'invalid phone number'
    ]
  },
  meta: {
    location: {
      city: { type: String, lowercase: true },
      address: { type: String, lowercase: true },
      country: { type: String, lowercase: true },
      zip_code: { type: String, lowercase: true, length: 6 },
    },
    payment: {
      expiry: { type: String, lowercase: true },
      provider: { type: String, lowercase: true },
      account_no: { type: String, lowercase: true },
      payment_type: { type: String, lowercase: true },
    }
  },
},
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function () {
  this.password = await passwords.hashPassword(this.password);
});

const User = model('User', UserSchema);

export {
  User as default
};