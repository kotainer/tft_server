const Router = require('koa-router');
const router = new Router({ prefix: '/api/client/v1' });
const convert = require('koa-convert');

import { Auth } from './auth';
import { Users } from './users';
import { Orders } from './orders';


import * as UserModel from '../../models/user';
import * as OrderModel from '../../models/order';


const auth = new Auth();
const users = new Users(UserModel, 'user');
const orders = new Orders(OrderModel, 'order');


router
    // AUTH

    .post('/auth/login', auth.login)
    .post('/auth/register', auth.register)

    // -----------------------------------------------


    // USERS
    .get('/user', users.getMyUser)

    .put('/user', users.updateMyUser)

    // -----------------------------------------------

    // ORDERS
    .get('/orders', orders.listMy)

    // -----------------------------------------------

    ;

export default router;
