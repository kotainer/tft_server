import { Crud } from '../crud-service';

import types from '../../utils/entryTypes';


export class Users extends Crud {
    constructor(model: any, type: string) {
        super(model, type);
    }

    safeUserFields = [
        '_id',
        'email',
        'login',
        'cardNumber',
        'phone',
        'city',
        'name',
        'lastname',
        'surname',
        'avatarBase',
        'avatar'
    ];

    getMyUser = async (ctx) => {
        const user = {};
        for (const field of this.safeUserFields) {
            user[field] = ctx.user[field];
        }

        ctx.body = {
            result: true,
            data: user
        }
    }

    updateMyUser = async (ctx) => {
        const user: any = {};
        for (const field of this.safeUserFields) {
            user[field] = ctx.request.body[field];
        }

        delete user.cardNumber;

        ctx.params.id = ctx.user._id;
        ctx.request.body = user;

        await this.update(ctx);
    }

}
