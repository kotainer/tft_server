import {Document, model, Model, Schema} from 'mongoose';

const appRootDir = require('app-root-dir').get();
const uuid = require('uuid');

interface IShop extends Document {
    name: string;
    percent: number;
    oldId: number;
    fiscalFeature: string;

    attach(field: string, file: any, callback: any): any;
};

const schema = new Schema({
    _id: {
        type: String,
        default: uuid,
    },

    name: String,

    type: String,

    userId: String,

    oldId: Number,

    user: {
      login: String,
      _id: String
    },

    percent: {
      type: Number,
      default: 0
    },

    fiscalNumbers: [String],

    isActive: {
        type: Boolean,
        default: true
      },

    createdAt: {
        type: Date,
        default: Date.now()
    },
});


const Shop = model<IShop>('Shop', schema);

export = Shop;
