import clientRouter from './client';
import pages from './client/pages';

import cmsRouter from './cms';
import { AdminPages } from './cms/pages';

const Router = require('koa-router');
const pagesCms = new AdminPages(null, null);

const clientIndexRouter = new Router();
clientIndexRouter
    .get('/', pages.landing);

const clientAllRouter = new Router();
clientAllRouter
    .get('/*', pages.landing);


const cmsIndexRouter = new Router();
cmsIndexRouter
    .get('/admin', pagesCms.main);

const cmsAllRouter = new Router();
cmsAllRouter
    .get('/admin/*', pagesCms.main);

const combineRouters = require('koa-combine-routers');
const router = combineRouters([
    clientIndexRouter,
    clientRouter,
    cmsIndexRouter,
    cmsRouter,
    cmsAllRouter,
    clientAllRouter
]);

export default router;
