import {Document, model, Model, Schema} from 'mongoose';
import * as User from './user';
import * as _ from 'lodash';

const uuid = require('uuid');

interface IUser {
    _id: string;
}

interface IPayment extends Document {
    total: number;
    number: number;
    isLoading: boolean;
    status: string;
    createdAt: Date;
    user: IUser;
}

const paymentSchema = new Schema({
    _id: {
        type: String,
        default: uuid,
    },

    total: Number,
    status: {
        type: String,
        default: 'pending',
        enum: [
            'pending',
            'completed',
            'canceled'
        ]
    },

    admin : {
        _id: String,
        login: String
    },

    user: {
        _id: String,
        login: String,
        balance: Number,
    },

    shop: {
        _id: String,
        name: String,
    },

    orderId: String,

    number: Number,
    isLoading: {
        type: Boolean,
        default: true,
    }, // true - начисление

    updatedAt: {
        type: Date,
        default: Date.now
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

}, {
    versionKey: '_somethingElse'
});

paymentSchema.set('versionKey', false);

const Payment = model<IPayment>('Payment', paymentSchema);

export = Payment;
