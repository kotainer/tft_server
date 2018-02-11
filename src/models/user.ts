import {Document, model, Model, Schema} from 'mongoose';

import crypto = require('crypto');

const appRootDir = require('app-root-dir').get();
const uuid = require('uuid');


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

  twoFactorTempSecret: string;
  twoFactorSecret: string;
  twoFactorEnabled: boolean;
  emailIsConfirmed: boolean;

  checkPassword(password: string): boolean;
}

const userSchema = new Schema({
  _id: {
    type: String,
    default: uuid,
  },
  name: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  surname: {
    type: String,
    default: ''
  },
  dob: Date,
  phone: String,
  city: String,
  skype: String,
  passport: String,
  address: String,

  email: {
    type: String,
    required: 'Укажите e-mail',
    trim: true
  },

  emailIsConfirmed: {
    type: Boolean,
    default: false
  },

  login: {
    type: String,
    required: 'Укажите логин',
    unique: 'Такой логин уже существует',
    trim: true
  },

  twoFactorTempSecret: String,
  twoFactorSecret: String,
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },

  parent: {
    type: String
  },

  isBanned: {
    type: Boolean,
    default: false
  },


  bannedTo: {
    type: Date,
    default: 0
  },

  verified: {
    type: Boolean,
    default: false
  },
  verificationCode: String,

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  },

  avatar: {},

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
      this.passwordHash = crypto.pbkdf2Sync(
        password, new Buffer(this.salt, 'binary'), 10000, 64, 'DSA-SHA1').toString('base64');
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
  return crypto.pbkdf2Sync(
    password, new Buffer(this.salt, 'binary'), 10000, 64, 'DSA-SHA1').toString('base64') == this.passwordHash;
};


const User = model<IUser>('User', userSchema);

export = User;
