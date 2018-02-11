import {Document, model, Model, Schema} from 'mongoose';

const uuid = require('uuid');

interface IAccess extends Document {
    slug: string;
}

const schema = new Schema({
    _id: {
        type: String,
        default: uuid,
    },

    name: String,

    access: [],

    createdAt: {
        type: Date,
        default: Date.now,
    },

});

const Access = model<IAccess>('Access', schema);

export = Access;
