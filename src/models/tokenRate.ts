import {Document, model, Model, Schema} from 'mongoose';

const uuid = require('uuid');

interface ITokenRate extends Document {
    token: string;
    tokenEqName: string;
    todayPrice: number;
    buyPrice: number;
}

const schema = new Schema({
    _id: {
        type: String,
        default: uuid,
    },

    token: String,
    tokenEqName: String,
    tokenPrice: String,

    todayPrice: {
        type: Number,
        default: 0,
    },

    buyPrice: {
        type: Number,
        default: 0,
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

});

const TokenRate = model<ITokenRate>('TokenRate', schema);

export = TokenRate;
