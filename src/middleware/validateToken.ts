const jwt = require('jsonwebtoken'); // аутентификация  по JWT для hhtp
const jwtsecret = 'LKlkaerKawfCashnprettygoodsecurekey'; // ключ для подписи JWT

import * as moment from 'moment';
import * as User from '../models/user';
import * as Admin from '../models/admin';

const notAuthMethod = [
    '/api/clients/v1/auth/register',
    '/api/clients/v1/auth/login',

    '/api/admin/auth/login',
    '/api/admin/auth/validate',
];

const doubleUsedMethod = [
    '/api/posts',
    '/api/comments'
];

const apiAttribute = '/api/';
const adminMethodAttribute = '/admin/';

const decodedToken = async (token) => {
    const decoded: any = await new Promise((resolve) => {
        jwt.verify(token.replace('JWT ', ''), jwtsecret, (err, info) => {
            if (info) {
                if (moment(info.expireAt) < moment()) {
                    return resolve(false);
                }
                return resolve(info);
            }
            return resolve(false);
        });
    });

    return decoded;
};

export default async (ctx, next) => {
    const url = ctx.request.url.split('?')[0];

    if (url.indexOf(apiAttribute) === -1) {
        return await next();
    }

    let isAdminMethod = false;
    let isNeedAuth = true;
    let doubleMethod = false;

    if (notAuthMethod.indexOf(url) > -1) {
        isNeedAuth = false;
    } else if (url.indexOf('/api/auth/verify/') > -1) {
        isNeedAuth = false;
    } else {
        for (const method of doubleUsedMethod) {
            if (url.indexOf(method) > -1) {
                doubleMethod = true;
                isNeedAuth = false;
            }
        }
    }

    if (url.indexOf(adminMethodAttribute) > -1) {
        isAdminMethod = true;
    }

    if (isNeedAuth) {
        const headerToken = ctx.headers.authorization;

        if (!headerToken) {
            throw {
                result: false,
                message: 'Пользователь неавторизирован',
                code: 401,
                status: 401
            };
        }

        const tokenInfo = await decodedToken(headerToken);

        if (!tokenInfo) {
            throw {
                result: false,
                message: 'Токен недействителен',
                code: 401,
                status: 401
            };
        }

        if (isAdminMethod && !tokenInfo.isAdmin) {
            throw {
                result: false,
                message: 'Недостаточно прав',
                code: 401,
                status: 401
            };
        }

        if (tokenInfo.isAdmin) {
            ctx.user = await Admin.findById(tokenInfo.id);
        } else {
            ctx.user = await User.findById(tokenInfo.id);
        }
    }

    if (doubleMethod) {
        const headerToken = ctx.headers.authorization;

        if (headerToken) {
            const tokenInfo = await decodedToken(headerToken);

            if (!tokenInfo) {
                throw {
                    result: false,
                    message: 'Токен недействителен',
                    code: 401,
                    status: 401
                };
            }

            if (isAdminMethod && !tokenInfo.isAdmin) {
                throw {
                    result: false,
                    message: 'Недостаточно прав',
                    code: 401,
                    status: 401
                };
            }

            if (tokenInfo.isAdmin) {
                ctx.user = await Admin.findById(tokenInfo.id);
            } else {
                ctx.user = await User.findById(tokenInfo.id);
                if (ctx.user.isBanned) {
                    throw {
                        result: false,
                        message: 'Пользователь заблокирован до выяснения обстоятельств',
                        code: 401,
                        status: 401
                    };
                }
            }
        }
    }

    ctx.compress = true;

    await next();
};
