import { Crud } from '../crud-service';

export class Comments extends Crud {
    constructor(model: any, type: string) {
        super(model, type);
    }

    listComments = async (ctx) => {
        ctx.extendQuery = {
            'post._id': ctx.params.postId
        };

        let { list, count } = await this.getList(ctx);
        list = list.reverse();

        ctx.body = {
            result: true,
            data: {
                list,
                count
            }
        };
    }

};
