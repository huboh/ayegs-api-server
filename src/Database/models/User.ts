import validator from 'validator';
import { passwords } from '../../utils';
import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  name: {
    type: String, lowercase: true, default: '',
  },
  avatarUrl: {
    type: String, lowercase: true, default: '',
  },
  lastName: {
    type: String, lowercase: true, default: '',
  },
  firstName: {
    type: String, lowercase: true, default: '',
  },
  isEmailVerified: {
    type: Boolean, default: false
  },
  isPhoneVerified: {
    type: Boolean, default: false
  },
  password: {
    type: String, required: [true, 'password is required'], minlength: [6, 'minimum password lenght is 6'], validate: [
      (password: string) => validator.isStrongPassword(password, { minLength: 6 }), 'password must contains at least 1 LowerCase letter, Uppercase letter & a Symbol'
    ]
  },
  email: {
    type: String, unique: true, required: [true, 'email address is required'], lowercase: true, validate: [
      validator.isEmail, 'invalid email address'
    ]
  },
  phone: {
    type: String, unique: true, default: '', validate: [
      // if phone number is not specified return true explicitly
      (number: string) => number ? validator.isMobilePhone(number, undefined, { strictMode: true }) : true, 'invalid phone number,please make sure country code is specified'
    ]
  },
  meta: {
    location: {
      city: { type: String, lowercase: true, default: '', },
      address: { type: String, lowercase: true, default: '', },
      country: { type: String, lowercase: true, default: '', },
      zipCode: { type: Number, default: null, },
    },
    payment: {
      expiry: { type: String, lowercase: true, default: '' },
      provider: { type: String, lowercase: true, default: '' },
      accountNo: { type: String, lowercase: true, default: '' },
      paymentType: { type: String, lowercase: true, default: '' },
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