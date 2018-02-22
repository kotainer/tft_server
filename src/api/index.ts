const Router = require('koa-router');

import clientRouter from './client';


const clientAllRouter = new Router();
clientAllRouter
    .get('/*', );


const combineRouters = require('koa-combine-routers');
const router = combineRouters([
    clientRouter,

    clientAllRouter
]);

export default router;
