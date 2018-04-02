import { Document, model, Model, Schema } from 'mongoose';

const uuid = require('uuid');

interface IComment extends Document {
    user: string;
    shop: string;
    isVisible: boolean;
    text: string;
    rating: number;
}

const schema = new Schema({
    _id: {
        type: String,
        default: uuid,
    },

    user: {
        type: String,
        ref: 'User',
        default: null
    },

    shop: {
        type: String,
        ref: 'Shop',
        default: null
    },

    text: String,
    rating: Number,

    isVisible: {
        type: Boolean,
        default: true,
    },

    updatedAt: {
        type: Date,
        default: Date.now
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

});

const Comment = model<IComment>('Comment', schema);

export = Comment;
