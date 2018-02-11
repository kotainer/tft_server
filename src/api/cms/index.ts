import { AdminAuth } from './auth';
import { Admin } from './admins';
import { Users } from './users';
import { Settings } from './settings';
import { Posts } from './posts';
import { Comments } from './comments';

import * as AdminModel from '../../models/admin';
import * as UserModel from '../../models/user';
import * as SettingsModel from '../../models/settings';
import * as PostModel from '../../models/post';
import * as CommentModel from '../../models/comment';

const convert = require('koa-convert');

const Router = require('koa-router');
const router = new Router({ prefix: '/api/admin' });

const admin = new Admin(AdminModel, 'admin');
const users = new Users(UserModel, 'userForAdmin');
const settings = new Settings(SettingsModel, 'settings');
const posts = new Posts(PostModel, 'postsForAdmin');
const comments = new Comments(CommentModel, 'comment');

const adminAuth = new AdminAuth();

router
    // AUTH
    .get('/auth/validate', adminAuth.validate)

    .post('/auth/login', adminAuth.login)
    // ------------------------------------------------

    // MANAGE ADMIN
    .post('/admin/new', admin.create)
    .post('/changePassword', admin.changePassword)
    // ------------------------------------------------


    // MANAGE USERS
    .get('/users', users.list)
    .get('/user/:email', users.getUserByEmail)

    .put('/user/:id', users.update)

    .post('/user/:id/banned', users.updateUserBanStatus)
    .post('/user/:id/changeUserPassword', users.changeUserPassword)

    .delete('/user/:id', users.delete)
    // ------------------------------------------------

    // CMS SETTINGS
    .get('/settings/:tag', settings.getSettingsByTag)

    .post('/settings', settings.create)

    .put('/settings/:id', settings.update)

    .delete('/settings/:id', settings.delete)
    // ------------------------------------------------

    // POSTS
    .get('/posts', posts.listPosts)
    .get('/post/:id', posts.show)

    .post('/posts', posts.createPost)

    .put('/post/:id', posts.update)

    .delete('/post/:id', posts.delete)
    // ------------------------------------------------

    // COMMENTS
    .get('/comments/:postId', comments.listComments)

    .delete('/comments/:id', comments.delete)
    // ------------------------------------------------

    ;

export default router;
