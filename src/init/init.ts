const mongoose = require('mongoose');
const config = require('config');
const uuid = require('uuid');
mongoose.Promise = global.Promise;
mongoose.connect(config.get('db'), {useMongoClient: true});

import * as Admin from '../models/admin';
import * as Settings from '../models/settings';
import * as User from '../models/user';

const baseInitiDB = async () => {
    // ADMIN
    if (!await Admin.findOne({login: 'admin'})) {
        await Admin.create({
            _id: uuid(),
            login: 'admin',
            password: 'qweqwe',
            email: 'admin',
            isAnswerTicket: true
        });
    }
    // ----------------------------------

    // SETTINGS
    if (!await Settings.findOne({tag: 'main'})) {
        await Settings.create({
            _id: uuid(),
            tag: 'main',
            body: {
                fastBonus: [0, 0, 0, 0],
                matching: {
                    nextDate: Date.now(),
                    period: '1',
                    levelPercents: [0, 0, 0]
                },
                qualifications: {}
            }
        });
    }

    if (!await Settings.findOne({tag: 'payments'})) {
        await Settings.create({
            _id: uuid(),
            tag: 'payments',
        });
    }
    // ----------------------------------

    // DEFAULT USERS
    let mlmUser = await User.findOne({login: 'mlm'});
    if (!mlmUser) {
        mlmUser = await User.create({
            _id: uuid(),
            login: 'mlm',
            password: 'mlm_bug',
            email: 'mlm',
        });
    }

    if (!await User.findOne({login: 'user'})) {
        await User.create({
            _id: uuid(),
            login: 'user',
            password: 'user',
            email: 'user',
            parent: mlmUser._id,
        });
    }
    // ----------------------------------

    mongoose.connection.close();
    console.log('default init complite');
};

baseInitiDB();
