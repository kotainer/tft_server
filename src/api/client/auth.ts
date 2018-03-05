import * as User from '../../models/user';
import * as Log from '../../models/log';
import * as Card from '../../models/card';

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
        if (!ctx.request.body.cardNumber) {
            throw {
                result: false,
                message: 'Номер карты не введён',
                code: 404
            };
        }

        ctx.request.body.cardNumber = ctx.request.body.cardNumber.replace(/-/g, '');

        const card = await Card.findOne({ cardNumber: ctx.request.body.cardNumber});
        if (!card) {
            throw {
                result: false,
                message: 'Карта с таким номером не существует',
                code: 404
            }; 
        }

        if (card.status === 'used') {
            throw {
                result: false,
                message: 'Карта уже активирована',
                code: 404
            };
        }

        if (card.cardCode !== ctx.request.body.pin) {
            throw {
                result: false,
                message: 'Неверный код активации',
                code: 404
            };
        }

        let parent = null;

        if (ctx.request.body.parentCard) {
            ctx.request.body.parentCard = ctx.request.body.parentCard.replace(/-/g, '');
            
            const parentUser = await User.findOne({ cardNumber: ctx.request.body.parentCard });
            if (!parentUser) {
                throw {
                    result: false,
                    message: 'Спонсора с таким номером карты не существует',
                    code: 404
                };
            }

            parent = parentUser._id;
        }

        const user: any = await User.create({
            cardNumber: ctx.request.body.cardNumber,
            login: ctx.request.body.cardNumber,
            password: ctx.request.body.password,
            email: ctx.request.body.email,
            parent
        });

        // mailer.sendRegisterMail(user);

        ctx.body = {
            result: true,
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
