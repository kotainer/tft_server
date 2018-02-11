import {Document, model, Model, Schema} from 'mongoose';

const uuid = require('uuid');

interface IPost extends Document {
    reactionsResults: any;
}

const schema = new Schema({
    _id: {
        type: String,
        default: uuid,
    },

    title: {
        type: String,
        default: '',
        required: 'Укажите заголовок',
    },

    body: {
        type: String,
        default: '',
        required: 'Отсутствует содержание',
    },

    images: [],
    tags: [],

    ifQuestionary: {
        type: Boolean,
        default: false,
    },
    questionary: {
        title: String,
        answers: [{
            id: {
                type: String,
                default: uuid,
            },
            title: String,
            answerCount: {
                type: Number,
                default: 0,
            }
        }],
    },

    questionaryResult: [
        {
            user: {
                _id: String,
                email: String
            },
            answer: {
                id: String,
                title: String
            }
        }
    ],

    reactions: {
        like: {
            type: Number,
            default: 0,
        },
        dislike: {
            type: Number,
            default: 0,
        }
    },

    reactionsResults: {
        like: [],
        dislike: []
    },

    isVisible: {
        type: Boolean,
        default: true,
    },

    telegramUrl: {
        type: String,
    },

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

const Post = model<IPost>('Post', schema);

export = Post;
