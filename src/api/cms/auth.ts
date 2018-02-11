import * as User from '../../models/admin';
import * as Log from '../../models/log';
import * as moment from 'moment';

import passport from '../../middleware/userAuthStategy';
const jwtsecret = 'sarafanprettygoodsecurekey'; // ключ для подписи JWT
const jwt = require('jsonwebtoken'); // аутентификация  по JWT для hhtp

export class AdminAuth {

    async login (ctx) {
        await passport.authenticate('local', function (err, user) {
            if (!user) {
                throw {
                    result: false,
                    message: 'Неверный логин или пароль',
                    code: '200'
                };
            } else {
                console.log(user);
                // --payload - информация которую мы храним в токене и можем из него получать
                const payload = {
                    id: user._id,
                    login: user.login,
                    email: user.email,
                    isAdmin: true,
                    expireAt: moment().add(200, 'minutes'),
                };
                const token = jwt.sign(payload, jwtsecret); // здесь создается JWT

                ctx.body = {
                    result: true,
                    data: {
                        token: 'JWT ' + token
                    }
                };
            }

        })(ctx);

    };

    async register (ctx) {
        try {
            ctx.body = await User.create(ctx.request.body);

            Log.create({
                tag: 'registerAdmin',
                action: 'Регистрация нового администратора',
                sender: ctx.body._id,
                more: JSON.stringify(ctx.request.body)
            }, () => { });

        } catch (err) {
            ctx.status = 400;
            ctx.body = err;
        }

    };

    // валидация jwt токена
    async validate (ctx) {
        await passport.authenticate('jwt', function (err, user) {
            if (user) {
                ctx.body = {
                    result: true,
                    user: user
                };
            } else {
                ctx.body = {
                    result: false,
                    user: null
                };

                Log.create({
                    tag: 'authFailureAdminJWT',
                    action: 'Неудачная авторизация по токену администратора',
                    more: JSON.stringify(ctx.request.header)
                }, () => { });
            }
        })(ctx);
    };

};
