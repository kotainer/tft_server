const Router = require('koa-router');
const router = new Router({ prefix: '/api/clients/v1' });
const convert = require('koa-convert');

import { Payments } from './payments';
 

const payments = new Payments();

router
    // PAYMENTS
    .get('/payments', payments.listMy)

    // -----------------------------------------------

    ;

export default router;
