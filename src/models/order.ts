import {Document, model, Model, Schema} from 'mongoose';
import * as User from './user';
import * as _ from 'lodash';

const uuid = require('uuid');

interface IUser {
    _id: string;
}

interface IOrder extends Document {
    total: number;
    status: string;
    number: number;
    cashback: number;
    cashbackOrigin: number;
    isSync: boolean;
    user: any;
    shop: any;
    parentOrder: string;
    purpose: string;
    admitadId: number;
    isPayed: boolean;
}

const schema = new Schema({
    _id: {
        type: String,
        default: uuid,
    },

    user: {
        _id: String,
        name: String,
        surname: String,
        login: String,
        cardNumber: String,
        avatar: {}
    },

    shop: {
        _id: String,
        name: String,
        logo: {},
        image: String
    },

    total: {
        type: Number,
        default: 0
    },

    cashback: {
        type: Number,
        default: 0
    },

    cashbackOrigin: {
        type: Number,
        default: 0
    },

    isSync: {
        type: Boolean,
        default: false
    },

    isPayed: {
        type: Boolean,
        default: false
    },

    status: {
        type: String,
        default: 'pending',
        enum: [
            'pending', // В обработке
            'approve', // Подтверждён
            'reject', // Если неверный чек
            'decline' // Отклонён магазином
        ]
    },

    admitadId: Number,

    isOnline: {
        type: Boolean,
        default: true
    },

    purpose: String,
    parentOrder: String,

    fiscalNumber: String, // fn

    fiscalDocumentNumber: String, // i

    fiscalFeature: {
        type: String,
        unique: true,
    }, // fp

    n: String, // n

    fiscalDate: Date, // t

    updatedAt: {
        type: Date,
        default: Date.now
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    number: Number,

});

const Order = model<IOrder>('Order', schema);

export = Order;
