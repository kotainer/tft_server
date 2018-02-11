import {Document, model, Model, Schema} from 'mongoose';

const uuid = require('uuid');

interface IComment extends Document {
    body: string;
    post: any;
    user: any;
}

const schema = new Schema({
    _id: {
        type: String,
        default: uuid,
    },

    post: {
        _id: String,
        title: String,
    },

    user: {
        type: String,
        ref: 'User',
        default: null
    },

    body: String,
    images: [],

    createdAt: {
        type: Date,
        default: Date.now,
    },

    updatedAt: {
        type: Date,
        default: Date.now,
    },

}, {
    usePushEach: true
});

const Comment = model<IComment>('Comment', schema);

export = Comment;
