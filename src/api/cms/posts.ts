import { Crud } from '../crud-service';

import types from '../../utils/entryTypes';

import * as asyncBusboy from 'async-busboy';
import * as Comment from '../../models/comment';

export class Posts extends Crud {
    constructor(model: any, type: string) {
        super(model, type);
    }

    createPost = async (ctx) => {
        let item;
        if (ctx.headers['content-type'].indexOf('multipart/form-data;') > -1) {
            const { fields, files } = await asyncBusboy(ctx.req);
            fields.questionary = JSON.parse(fields.questionary);
            item = await this.model.create(fields);
            item.images = await this.attachFiles(files);
            await item.save();
        } else {
            item = await this.model.create(ctx.request.body);
        }

        ctx.body = {
            result: true,
            data: item
        };
    }

    listPosts = async (ctx) => {
        const processedList = [];
        const {list, count} = await this.getList(ctx);

        for (const item of list) {

            const processedItem = Object.assign({
                comments: {
                    list: [],
                    count: 0
                },
                userReactions: 'none'
            }, item._doc);

            let comments = await Comment.find({
                'post._id': item._id
            }).select(types['comment'].fields)
            .populate('user', 'name lastName surname email avatar')
            .limit(3).sort('-createdAt');
            comments = comments.reverse();

            processedItem.comments.list = comments;
            processedItem.comments.count = await Comment.count({'post._id': item._id});

            delete processedItem['questionaryResult'];
            delete processedItem['reactionsResults'];
            processedList.push(processedItem);
        }

        ctx.body = {
            result: true,
            list: processedList,
            count
        };
    }

}
