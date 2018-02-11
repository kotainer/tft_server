import { Crud } from '../crud-service';

export class Admin extends Crud {
    constructor(model: any, type: string) {
        super(model, type);
    }

    changePassword = async (ctx) => {
        const item = await this.model.findOne({login: 'admin'});

        if (!item.checkPassword(ctx.request.body.oldPassword)) {
            throw {
                result: false,
                message: 'Неверный пароль',
                code: 400
            };
        }

        const response = await this.saveNewPassToMS(item.email, ctx.request.body.newPassword);
        if (response !== 200) {
            throw {
                result: false,
                message: 'Неверный пароль',
                code: 400
            };
        }

        item.password = ctx.request.body.newPassword;
        await item.save();

        ctx.body = {
            result: true
        };
    }

}
