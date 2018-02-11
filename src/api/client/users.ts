import { Crud } from '../crud-service';

import * as User from '../../models/user';
import * as Log from '../../models/log';

import * as asyncBusboy from 'async-busboy';

import types from '../../utils/entryTypes';

const QRCode = require('qrcode');
const speakeasy = require('speakeasy');
const fs = require('fs');
const fse = require('fs-extra');
const appRootDir = require('app-root-dir').get();

import crypto = require('crypto');


export class Users extends Crud {
    constructor(model: any, type: string) {
        super(model, type);
    }

    setTFA = async (ctx) => {
        let dataUrl;
        const secret = speakeasy.generateSecret();
        ctx.user.twoFactorTempSecret = secret.base32;
        await ctx.user.save();
        await new Promise(resolve => {
            QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
                if (!err) {
                    dataUrl = data_url;
                    resolve();
                } else {
                    throw { message: err, code: '400' };
                }
            });
        });
        ctx.body = {
            result: true,
            data: {
                qrcode: dataUrl
            }
        };
        ctx.status = 200;
    }

    enableTFA = async (ctx) => {
        const userToken = ctx.request.body.token;
        const twoFactorTempSecret = ctx.user.twoFactorTempSecret;
        const verified = speakeasy.totp.verify({
            secret: twoFactorTempSecret,
            encoding: 'base32',
            token: userToken,
            window: 6,
            step: 30
        });
        if (verified) {
            ctx.user.twoFactorSecret = ctx.user.twoFactorTempSecret;
            ctx.user.twoFactorTempSecret = '';
            ctx.user.twoFactorEnabled = true;
            await ctx.user.save();
            ctx.body = {
                result: true
            };
            ctx.status = 200;
        } else {
            ctx.user.twoFactorTempSecret = '';
            await ctx.user.save();
            throw {
                message: 'Incorrect token',
                code: 400
            };
        }
    }

    disableTFA = async (ctx) => {
        const userToken = ctx.request.body.token;
        const twoFactorSecret = ctx.user.twoFactorSecret;
        const verified = speakeasy.totp.verify({
            secret: twoFactorSecret,
            encoding: 'base32',
            token: userToken,
            window: 6,
            step: 30
        });
        if (verified) {
            ctx.user.twoFactorSecret = '';
            ctx.user.twoFactorTempSecret = '';
            ctx.user.twoFactorEnabled = false;
            await ctx.user.save();
            ctx.body = {
                result: true
            };
            ctx.status = 200;
        } else {
            throw {
                message: 'Incorrect code',
                code: 400
            };
        }
    }

    updateInfo = async (ctx) => {
        const updatedItem = ctx.request.body;

        if (updatedItem.avatarBase) {
            const base64Data = updatedItem.avatarBase.replace(/^data:image\/png;base64,/, '');

            const newDir = `${appRootDir}/public/img/avatars`;
            fse.ensureDirSync(newDir);

            await new Promise(resolve => {
                fs.writeFile(`${newDir}/${updatedItem._id}.png`, base64Data, 'base64', function(err) {
                    if (err) {
                        throw err;
                    }
                    resolve();
                });
            });

            updatedItem.avatar = {
                img: `/img/avatars/${updatedItem._id}.png`
            };

            delete updatedItem.avatarBase;
        }

        await User.update({ _id: ctx.user._id }, updatedItem);
        ctx.body = {
            result: true,
            data: updatedItem
        };
    }

    changePassword = async (ctx) => {
        ctx.user.password = ctx.request.body.password;
        await ctx.user.save();
        ctx.status = 200;
        ctx.body = {
            result: true
        };
    }

    getUser = async (ctx) => {
        if (!ctx.user) {
            throw {
                result: false,
                message: 'Пользователь не найден',
                code: 401
            };
        }

        const user = Object.assign({}, ctx.user._doc);

        delete user.password;
        delete user.salt;
        delete user.passwordHash;

        ctx.body = {
            result: true,
            data: user
        };
    }
};
