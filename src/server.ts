import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as chalk from 'chalk';

import * as serve from 'koa-static';
import * as logger from 'koa-logger';
import * as compress from 'koa-compress';
import * as conditional from 'koa-conditional-get';
import * as etag from 'koa-etag';

import { Tasks } from './tasks';

const tasks = new Tasks().runTasks();

import routes from './api';

import passport from './middleware/userAuthStategy';
import err from './middleware/error';
import validate from './middleware/validateToken';

const env = process.env.NODE_ENV || 'dev';
const port = process.env.PORT || 82;

const app = new Koa();

const appRootDir = require('app-root-dir').get();
const config = require('config');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// mongoose.set('debug', true); // вываливаем все запросы в консоль

mongoose.connect(config.get('db'));


// app.use(conditional());
app.use(etag());
// app.use(compress({
//     flush: require('zlib').Z_SYNC_FLUSH
// }));

app.use(bodyParser({
    formLimit: '7mb'
}));
app.use(serve(appRootDir + '/public'));

app.use(err);
app.use(validate);

if (env === 'localDev') {
    app.use(logger());
}

app.use(passport.initialize());
app.use(routes);


const server = app.listen(port, () => {
    if (env === 'localDev') {
        console.log(chalk.black.bgGreen.bold(`Listening on port: ${port}; db: ${config.get('db')}; env: ${env}`));
        console.log(chalk.red.bold('А ты помнишь про TDD? Написал(а) тесты?'));
    } else {
        console.log(chalk.red.bold(`Сервер CREASE запущен на ${port};`));
    };
});


const appServer = {
    server: server,
};

export default appServer;
