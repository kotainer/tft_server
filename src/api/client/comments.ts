import { Crud } from '../crud-service';

export class Comments extends Crud {
    constructor(model: any, type: string) {
        super(model, type);
    }


    listForShop = async (ctx) => {
        ctx.extendQuery = {
            'shop': ctx.params.id
        }

        await this.list(ctx);
    }
}
