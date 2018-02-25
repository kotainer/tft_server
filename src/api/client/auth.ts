import * as User from '../../models/user';
import * as Log from '../../models/log';

import { Mailer } from '../../services/mailer';
import * as moment from 'moment';
import passport from '../../middleware/userAuthStategy';

const mailer = new Mailer();
const config = require('config');

const jwtsecret = 'LKlkaerKawfCashnprettygoodsecurekey';
const jwt = require('jsonwebtoken');

export class Auth {
    login = async (ctx) => {
        await passport.authenticate('local', function (err, user) {
            if (!user) {
                throw {
                    message: 'invalidAuthInfo',
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
                const token = jwt.sign(payload, jwtsecret);

                ctx.body = {
                    result: true,
                    data: {
                        token: 'JWT ' + token,
                        user: {
                            _id: user._id,
                            cardNumber: user.cardNumber,
                            login: user.login,
                            email: user.email,
                            name: user.name,
                            city: user.city,
                            isShopOwner: user.isShopOwner
                        }
                    }
                };
            }

        })(ctx);

    }

    register = async (ctx) => {
        if (!ctx.request.body.login) {
            throw {
                result: false,
                message: 'Email не введён',
                code: 404
            };
        }

        const user: any = await User.create(ctx.request.body);

        mailer.sendRegisterMail(user);

        ctx.body = {
            result: true,
            message: 'succesAuth',
            data: user
        };

        Log.create({
            tag: 'register',
            action: 'Регистрация нового пользователя',
            sender: ctx.body._id,
            more: JSON.stringify(ctx.request.body),
            date: moment()
        }, () => { });
    }

};
