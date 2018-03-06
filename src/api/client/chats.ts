import { Users } from './users';
import { Crud } from '../crud-service';

import * as User from '../../models/user';
import * as Admin from '../../models/admin';
import * as _ from 'lodash';

export class Chats extends Crud {
    constructor(model: any, type: string) {
        super(model, type);
    }


    listMy = async (ctx) => {
        ctx.extendQuery = {
            'users._id': ctx.user._id
        }

        await this.list(ctx);
    }

    createSupportChat = async (ctx) => {
        const chat = await new this.model({
            isSupport: true,
            name: 'Чат с поддержкой',
            users: [],
            messages: [],
            newMessagesCount: {}
        });

        const admins = await Admin.find({
            isAnswerTicket: true
        });

        chat.users.push({
            _id: ctx.user._id,
            isAdmin: false,
        })

        chat.newMessagesCount[ctx.user._id] = 0;

        for (const admin  of admins) {
            chat.users.push({
                _id: admin._id,
                isAdmin: true,
            })

            chat.newMessagesCount[admin._id] = 0;
        }

        await chat.save();

        ctx.body = {
            result: true
        }
    }

    getChat = async (ctx) => {
        const chat = await this.model.findById(ctx.params.id).lean() as any;

        if (!chat) {
            throw {
                message: 'invalidId',
                code: 404
            };
        }

        const acces = chat.users.find(el => el._id === ctx.user._id);

        if (!acces) {
            throw {
                message: 'notAccess',
                code: 404
            };
        }

        const users = await User.find({
            _id: {
                $in: chat.users.map(el => el._id)
            }
        }).select('lastname name avatar surname').lean() as any;

        const admins = await Admin.find({
            _id: {
                $in: chat.users.map(el => el._id)
            }
        }).select('name avatar login').lean() as any;

        let skip = 0;
        if (ctx.query.skip) {
            skip = parseInt(ctx.query.skip, 10);
        }

        let limit = 10;
        if (ctx.query.limit) {
            limit = parseInt(ctx.query.limit, 10);
        }

        let allMessages = chat.messages.reverse();
        allMessages = allMessages.splice(skip);

        const messages = _.take(allMessages, limit) as any;

        for (const m of messages) {
            let sender = admins.find(el => el._id === m.sender);
            if (!sender) {
                sender = users.find(el => el._id === m.sender);
            }

            m.sender = sender;
        }

        ctx.body = {
            result: true,
            data: messages.reverse()
        }
    }

    chatForUser = async (ctx) => {
        const userChats = await this.model.find({
            'users._id': ctx.user._id
        }).select('users').lean() as any;

        const user = await User.findById(ctx.params.id);

        if (!user) {
            throw {
                message: 'itemNotFound',
                code: 404
            };
        }

        for (const item of userChats) {
            const exist = item.users.find(el => el._id === user._id);
            if (exist) {
                return ctx.body = {
                    result: true,
                    data: item._id
                }
            } 
        }

        const chat = new this.model({
            name: `${user.lastname || ''} ${user.name || ''}`,
            newMessagesCount: {
                [ctx.user._id]: 0,
                [user._id]: 0
            }
        });

        chat.users.push({
            _id: ctx.user._id,
            isAdmin: false
        });

        chat.users.push({
            _id: user._id,
            isAdmin: false
        })

        await chat.save();


        ctx.body = {
            result: true,
            data: chat._id
        }
    }
}
