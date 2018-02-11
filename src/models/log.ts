import {Document, model, Model, Schema} from 'mongoose';

const uuid = require('uuid');

interface ILog extends Document {
    action: string;
    sender: string;
    date: string;
    more: string;
    tag: string;
    typeId: number;
}

const logSchema = new Schema({
    _id: {
        type: String,
        default: uuid,
    },

    action: String,
    tag: String,
    /*
        Типы логов
        1 - Авторизация
    */
    typeId: {
        type: Number,
        default: 1
    },
    sender: {
        type: String,
        ref: 'User',
        default: null
    },
    more: String,
    createdAt: {
        type: Date,
        default: Date.now
    },

});

logSchema.methods.awesomeMethods = function () {

};

const Log = model<ILog>('Log', logSchema);

export = Log;
