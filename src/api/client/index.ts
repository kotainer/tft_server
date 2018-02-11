const Router = require('koa-router');
const router = new Router({ prefix: '/api' });
const convert = require('koa-convert');

import auth from './auth';
import { Users } from './users';
import { Posts } from './posts';
import { Comments } from './comments';
import { TokenPrices } from './tokenPrices';


import * as UserModel from '../../models/user';
import * as PostModel from '../../models/post';
import * as CommentModel from '../../models/comment';
import * as TokenRate from '../../models/tokenRate';

const users = new Users(UserModel, 'user');
const tokens = new TokenPrices(TokenRate, 'tokenRate');
const posts = new Posts(PostModel, 'post');
const comments = new Comments(CommentModel, 'comment');

router
    // AUTH
    .get('/auth/validate', auth.validate)
    .post('/auth/login', auth.login)
    .post('/auth/register', auth.register)
    .post('/auth/restore', auth.restorePass)
    .post('/auth/verify/:userId', auth.verify)

    // 2FA
    .post('/auth/tfa/verify/:userId', auth.verifyTFAuthToken)
    // ------------------------------------------------

    // USERS
    .get('/user', users.getUser)

    .put('/user', users.updateInfo)
    .put('/user/:userId/changePassword', users.changePassword)
    .put('/user/:userId/tfa/set/', users.setTFA)
    .put('/user/:userId/tfa/enable/', users.enableTFA)
    .put('/user/:userId/tfa/disable/', users.disableTFA)
    // ------------------------------------------------

    // POSTS
    .get('/posts', posts.listPosts)

    .post('/post/:id/comment', posts.commentPost)
    .post('/post/:id/like', posts.likePost)
    .post('/post/:id/dislike', posts.dislikePost)
    .post('/post/:id/questionary/answer', posts.postAnswerQuestionary)
    // ------------------------------------------------

    // COMMENTS
    .get('/comments/:postId', comments.listComments)
    // ------------------------------------------------

    // COMMENTS
    .get('/coins/price', tokens.getCurrentPrice)
    .get('/coins/portfolio', tokens.portfolioPrice)
    .get('/coins/list', tokens.portfolioList)
    // ------------------------------------------------

    ;

export default router;
