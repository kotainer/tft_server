import {Document, model, Model, Schema} from 'mongoose';

const uuid = require('uuid');

interface IShop extends Document {
    name: string;
    percent: number;
    oldId: number;
    fiscalFeature: string;
    isAdmitad: boolean;
    admitadId: number;
    description: string;
    rawDescription: string;
    regions: any;
    siteUrl: string;
    avgHoldTime: number;
    nameAliases: string;
    avgMoneyTransferTime: string;
    actions: string;
    currency: string;
    image: string;
    rating: number;
    categories: any;
    isActive: boolean;
    updatedAt: any;
    gotoLink: string;
    city: string;
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

    description: String,

    isAdmitad: {
        type: Boolean,
        default: false
    },

    // ADMITAD
    admitadId: Number,
    rawDescription: String,
    regions: [],
    siteUrl: String,
    avgHoldTime: Number,
    nameAliases: String,
    avgMoneyTransferTime: String,
    actions: [],
    gotoLink: String,
    //

    currency: String,
    city: String,
    image: String,
    rating: Number,
    categories: [],

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
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    },
});


const Shop = model<IShop>('Shop', schema);

export = Shop;
