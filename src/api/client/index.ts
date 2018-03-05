const Router = require('koa-router');
const router = new Router({ prefix: '/api/clients/v1' });
const convert = require('koa-convert');

import { Auth } from './auth';
import { Users } from './users';
import { Orders } from './orders';
import { Chats } from './chats';


import * as UserModel from '../../models/user';
import * as OrderModel from '../../models/order';
import * as ChatModel from '../../models/chat';


const auth = new Auth();
const users = new Users(UserModel, 'user');
const orders = new Orders(OrderModel, 'order');
const chats = new Chats(ChatModel, 'chat');


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

    // CHATS
    .get('/chats', chats.listMy)
    .get('/chat/:id', chats.getChat)

    .post('/chat/support', chats.createSupportChat)

    // -----------------------------------------------

    ;

export default router;
