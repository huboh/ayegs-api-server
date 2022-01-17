import validator from 'validator';
import { passwords } from '../utils';
import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  name: {
    type: String
  },
  avatar_url: {
    type: String
  },
  last_name: {
    type: String
  },
  first_name: {
    type: String
  },
  email_verified: {
    type: Boolean, default: false
  },
  phone_verified: {
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
},
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function () {
  this.password = await passwords.hashPassword(this.password);
});

const Users = model('User', UserSchema);

export {
  Users as default
};