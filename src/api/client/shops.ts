import { Crud } from '../crud-service';

export class Shops extends Crud {
    constructor(model: any, type: string) {
        super(model, type);
    }

    showShop = async (ctx) => {
        const item = await this.model.findById(ctx.params.id).lean();

        ctx.body = {
            result: true,
            data: item
        }
    }
}
