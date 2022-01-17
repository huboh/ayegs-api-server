import validator from 'validator';
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
  username: {
    type: String, unique: true, minlength: 3, required: [true, 'username is required'], validate: [
      validator.isAlphanumeric, 'username can only contains letters and numbers.'
    ]
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
  console.log('pre', this);
});

const Users = model('User', UserSchema);

export {
  Users as default
};

// Users.create({
//   name: 'john doe',
//   avatar_url: 'https://www.google.com',
//   last_name: 'doe',
//   first_name: 'john',
//   email_verified: true,
//   email: 'johndoe@mail.com',
//   phone_verified: true,
//   phone: '090464535552',
//   password: 'dfdiof87w3ey',
//   username: 'hwyry3'
// });