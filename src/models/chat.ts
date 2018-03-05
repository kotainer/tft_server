import {Document, model, Model, Schema} from 'mongoose';

const uuid = require('uuid');

interface IChat extends Document {
    users: any;
    name: string;
    messages: any;
    isSupport: boolean;
    newMessagesCount: any;
}

const schema = new Schema({
    _id: {
        type: String,
        default: uuid,
    },

    name: String,

    users: [],
    messages: [],
    partNumber: {
        type: Number,
        default: 0
    },

    isSupport: {
        type: Boolean,
        default: false,
    },

    newMessagesCount: {},

    updatedAt: {
        type: Date,
        default: Date.now
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

});

const Chat = model<IChat>('Chat', schema);

export = Chat;
