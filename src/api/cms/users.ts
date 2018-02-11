const pug = require('pug');
const appRootDir = require('app-root-dir').get();

import types from '../../utils/entryTypes';
import * as moment from 'moment';
import * as User from '../../models/user';

import * as Log from '../../models/log';

import * as mongoose from 'mongoose';
import { Crud } from '../crud-service';

export class Users extends Crud {
    constructor(model: any, type: string) {
        super(model, type);
    }

    updateUserBanStatus = async (ctx) => {
        const bannedTo = 0;
        const isBanned = ctx.request.body.isBanned === 'true' ? true : false;
        const res = await User.update(
            {_id: ctx.params.id},
            {isBanned});
        ctx.body = {
            result: true,
            data: res
        };
    }

    getUserByEmail = async (ctx) => {
        const item = await User.findOne({email: ctx.params.email}).select(types[this.entryType].fields);
        if (item) {
            ctx.body = {
                result: true,
                data: item
            };
        } else {
            ctx.body = {
                result: false,
                message: 'Такого пользователя не существует'
            };
        }
    }

    changeUserPassword = async (ctx) => {
        const item = await User.findById(ctx.params.id).select(types[this.entryType].fields);

        const response = await this.saveNewPassToMS(item.email, ctx.request.body.password);
        if (response !== 200) {
            throw {
                result: false,
                message: 'Неверный пароль',
                code: 400
            };
        }

        item.password = ctx.request.body.password;
        await item.save();
        ctx.body = {
            result: true,
            data: item
        };
    }

};
