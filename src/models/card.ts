import {Document, model, Model, Schema} from 'mongoose';

const uuid = require('uuid');

interface ICard extends Document {
    status: string;
    cardNumber: string;
    cardCode: string;
}

const schema = new Schema({
    _id: {
        type: String,
        default: uuid,
    },
    
    status: {
        type: String,
        default: 'unused',
        enum: [
            'used',
            'unused'
        ]
    },

    cardNumber: String,
    cardCode: String,

    updatedAt: {
        type: Date,
        default: Date.now
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

});

const Card = model<ICard>('Card', schema);

export = Card;
