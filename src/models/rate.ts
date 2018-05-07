import {Document, model, Model, Schema} from 'mongoose';
import * as uuid from 'uuid';

interface IRate extends Document {
    prices: any;
    createdAt: Date;
}

const schema = new Schema({
    _id: {
        type: String,
        default: uuid,
    },
    prices: {},
    createdAt: {
        type: Date,
        default: Date.now
    },

});

const Rate = model<IRate>('Rate', schema);

export = Rate;
