const Router = require('koa-router');
const router = new Router({ prefix: '/api/clients/v1' });
const convert = require('koa-convert');

import { Auth } from './auth';
import { Users } from './users';
import { Orders } from './orders';
import { Chats } from './chats';
import { Payments } from './payments';
import { Shops } from './shops';
 

import * as UserModel from '../../models/user';
import * as OrderModel from '../../models/order';
import * as ChatModel from '../../models/chat';
import * as ShopModel from '../../models/shop';


const auth = new Auth();
const users = new Users(UserModel, 'user');
const orders = new Orders(OrderModel, 'order');
const chats = new Chats(ChatModel, 'chat');
const payments = new Payments(OrderModel, 'order');
const shops = new Shops(ShopModel, 'shop');

router
    // AUTH

    .post('/auth/login', auth.login)
    .post('/auth/register', auth.register)

    // -----------------------------------------------


    // USERS
    .get('/user', users.getMyUser)
    .get('/user/structure', users.getMyStructure)
    .get('/user/:id/chat', chats.chatForUser)

    .put('/user', users.updateMyUser)

    // -----------------------------------------------

    // ORDERS
    .get('/orders', orders.listMy)

    // -----------------------------------------------

    // PAYMENTS
    .get('/payments', payments.listMy)

    // -----------------------------------------------

    // CHATS
    .get('/chats', chats.listMy)
    .get('/chat/:id', chats.getChat)

    .post('/chat/support', chats.createSupportChat)

    // -----------------------------------------------

    // SHOPS
    .get('/shop/:id', shops.showShop)
    .get('/shops/popular', shops.list)

    // -----------------------------------------------

    ;

export default router;
