import { Crud } from '../crud-service';

import * as User from '../../models/user';
import * as Admin from '../../models/admin';

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
}
