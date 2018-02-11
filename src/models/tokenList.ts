import {Document, model, Model, Schema} from 'mongoose';

const uuid = require('uuid');

interface ITokenList extends Document {
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

    avatar: String,
    name: String,
    id: String,
    creaseEndDate: Date,
    creaseStartDate: Date,
    tokenPrice: String,
    startBonus: String,
    todayPrice: String,
    btcPrice: String,
    ethPrice: String,

    createdAt: {
        type: Date,
        default: Date.now
    },

});

const TokenList = model<ITokenList>('TokenList', schema);

export = TokenList;
