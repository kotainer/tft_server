import * as User from '../../models/user';
import * as Log from '../../models/log';

import { Mailer } from '../../services/mailer';
import * as moment from 'moment';
import passport from '../../middleware/userAuthStategy';

const mailer = new Mailer();
const jwtsecret = 'sarafanprettygoodsecurekey'; // ключ для подписи JWT
const jwt = require('jsonwebtoken'); // аутентификация  по JWT для hhtp
const appRootDir = require('app-root-dir').get();
const config = require('config');
const securityToken = config.get('adminSecretKeyMS');
const request = require('request');
const speakeasy = require('speakeasy');
const googl = require('goo.gl');
const googleApiKey = config.get('google_api_key');

const crud = {

    verifyTFAuthToken: async (ctx) => {
        const user = await User.findById(ctx.params.userId);
        if (user) {
            const userToken = ctx.request.body.token;
            const twoFactorSecret = user.twoFactorSecret;
            const verified =  speakeasy.totp.verify({
                secret: twoFactorSecret,
                encoding: 'base32',
                token: userToken,
                window: 6,
                step: 30
            });
            if (verified) {
                ctx.body = { status: 'ok' };
                ctx.status = 200;
            } else {
                throw { message: 'Incorrect code', code: '400' };
            }
        } else {
            throw { message: 'The user does not exist', code: '404' };
        }
    },

    login: async (ctx) => {
        await passport.authenticate('local', function (err, user) {
            if (!user) {
                throw {
                    message: 'Неверный Email или пароль',
                    code: 401
                };

            } else {
                const payload = {
                    id: user._id,
                    login: user.login,
                    email: user.email,
                    isAdmin: false,
                    expireAt: moment().add(500, 'minutes'),
                };
                const token = jwt.sign(payload, jwtsecret); // здесь создается JWT

                ctx.body = {
                    result: true,
                    data: {
                        twoFactorEnabled: user.twoFactorEnabled,
                        emailIsConfirmed: user.emailIsConfirmed,
                        token: 'JWT ' + token,
                        user: {
                            id: user._id,
                            login: user.login,
                            email: user.email,
                            name: user.name
                        }
                    }
                };
            }

        })(ctx);

    },

    register: async (ctx) => {
        try {
            if (!ctx.request.body.login) {
                throw {
                    result: false,
                    message: 'Email не введён',
                    code: 404
                };
            }

            googl.setKey(googleApiKey);
            googl.getKey();

            const user: any = await User.create(ctx.request.body);

            const longUrl = ctx.header.origin + '/sk/' + user._id;
            await googl.shorten(longUrl).then(async (shortUrl) => {
                user.referralUrl = shortUrl;
                await user.save();
            });

            mailer.sendRegisterMail(user);
            ctx.body = {
                result: true,
                message: 'Регистрация прошла успешно. Подтвердите ваш Email-адрес',
                data: user
            };
            Log.create({
                tag: 'register',
                action: 'Регистрация нового пользователя',
                sender: ctx.body._id,
                more: JSON.stringify(ctx.request.body),
                date: moment()
            }, () => { });
        } catch (err) {
            throw {
                result: false,
                message: err,
                code: 400
            };
        }

    },

    verify: async (ctx) => {
        const user = await User.findById(ctx.params.userId);
        if (user) {
            user.emailIsConfirmed = true;
            await user.save();
            ctx.body = { status: 'ok' };
            ctx.status = 200;
        } else {
            throw {
                result: false,
                message: 'Пользователь не найден',
                code: 404
            };
        }
    },

    restorePass: async (ctx) => {
        if (ctx.request.body.email) {
            const user: any = await User.findOne({email: ctx.request.body.email});
            if (user) {
                const newPassword = generatePass();
                console.log(newPassword);
                await saveNewPassToMS(user.email, newPassword).then(async (response) => {
                    if (response === 200) {
                        user.password = newPassword;
                        mailer.sendRestorePassMail(user, newPassword);
                        await user.save();
                        ctx.status = 200;
                        ctx.body = {
                            result: true,
                            message: 'На ваш Email отправлено письмо с новым паролем.',
                        };
                    }
                }, async (error) => {
                    throw {
                        result: false,
                        message: error,
                        code: 400
                    };
                }
            );
            } else {
                throw {
                    result: false,
                    message: `Пользователь с таким Email не существует`,
                    code: 404
                };
            }
        } else {
            throw {
                result: false,
                message: `Email не введён`,
                code: 400
            };
        }

    },

    // валидация jwt токена
    validate: async (ctx) => {
        await passport.authenticate('jwt', function (err, user) {
            if (user) {
                ctx.body = {
                    result: true,
                    data: user
                };
            } else {
                ctx.body = {
                    result: false,
                    message: 'Неверный токен или закочилось время его действия'
                };
            }

        })(ctx);
    },

};

function generatePass() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 7; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function saveNewPassToMS (user, password) {
    const requestData: Object = {
        userName: user,
        newPassword: password,
        securityToken: securityToken,
    };
    
    return new Promise((resolve, reject) => {
        request.post('http://api.runico.io:83/api/User/restorePassword', { json: requestData }, (err, response, body) => {
            if (err) {
                console.log(err)
                reject(Error(err));
            } else {
                resolve(response.statusCode);
            };
        });
        request.onerror = function () {
            reject(Error('Network Error'));
        };
    });
}

export default crud;
