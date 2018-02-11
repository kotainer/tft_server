export default async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        if (typeof err.message === 'object') {
            if (err.message.errmsg.indexOf('E11000 duplicate key error collection') > -1) {
                err.message = 'Указанная почта уже занята';
            }
        }

        ctx.status = err.statusCode || err.status || 200;
        ctx.body = {
            result: false,
            message: err.message,
            code: err.code || 200
        };
    }
};
