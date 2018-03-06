import { Crud } from '../crud-service';

export class Payments extends Crud {
    constructor(model: any, type: string) {
        super(model, type);
    }


    listMy = async (ctx) => {
        ctx.extendQuery = {
            'user._id': ctx.user._id
        }

        await this.list(ctx);
    }
}
