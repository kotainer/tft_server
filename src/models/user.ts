import { Document, model, Model, Schema } from 'mongoose';

import crypto = require('crypto');

const appRootDir = require('app-root-dir').get();
const uuid = require('uuid');
const config = require('config');

interface IUser extends Document {
  password: string;
  name: string;
  lastame: string;
  surname: string;
  sex: string;
  dob: Date;
  email: string;
  login: string;
  phone: string;
  city: string;
  skype: string;
  address: string;
  isMain: boolean;
  isShopOwner: boolean;
  isBayer: boolean;
  isCustomer: boolean;
  shopId: string;

  balance: number;

  passwordHash: string;
  salt: string;
  parent: string;
  photo: any;
  oldData: any;
  passport: string;

  checkPassword(password: string): boolean;
}

const userSchema = new Schema({
  _id: {
    type: String,
    default: uuid,
  },
  name: String,
  lastname: String,
  surname: String,
  dob: Date,
  phone: String,
  city: String,
  skype: String,
  passport: String,
  address: String,

  cardNumber: {
    type: String,
    // unique: 'Такая карта уже существует',
  },

  email: {
    type: String,
  },

  login: {
    type: String,
    unique: 'Такой логин уже существует'
  },

  sex: {
    type: String,
    enum: ['male', 'female'],
    default: 'male'
  },

  parent: {
    type: String,
    ref: 'User',
    default: null
  },

  balance: {
    type: Number,
    default: 0
  },

  isBanned: {
    type: Boolean,
    default: false
  },

  isShopOwner: {
    type: Boolean,
    default: false
  },

  isBayer: {
    type: Boolean,
    default: true
  },

  isCustomer: {
    type: Boolean,
    default: true
  },

  shopId: String,

  isMain: {
    type: Boolean,
    default: false
  },

  bannedTo: {
    type: Date,
    default: 0
  },

  oldData: {
    id: String,
    card_id: String,
    refer_id: String,
    balance: Number
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  },

  passwordHash: String,
  salt: String,
});


userSchema.pre('save', function (next) {
  return next();
});

userSchema.virtual('password')
  .set(function (password) {
    this._plainPassword = password;
    if (password) {
      this.salt = crypto.randomBytes(4).toString('hex');
      this.passwordHash = crypto.createHash('md5').update(password + config.get('oldSalt')).digest('hex');
    } else {
      this.salt = undefined;
      this.passwordHash = undefined;
    }
  })

  .get(function () {
    return this._plainPassword;
  });

userSchema.methods.checkPassword = function (password) {
  if (!password) {
    return false;
  }
  if (!this.passwordHash) {
    return false;
  }

  return crypto.createHash('md5').update(password + config.get('oldSalt')).digest('hex') == this.passwordHash;
};

const User = model<IUser>('User', userSchema);

export = User;
