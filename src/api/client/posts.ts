import { Crud } from '../crud-service';

import types from '../../utils/entryTypes';

import * as Comment from '../../models/comment';

export class Posts extends Crud {
    constructor(model: any, type: string) {
        super(model, type);
    }

    listPosts = async (ctx) => {
        if (!ctx.user) {
            return this.listNoAuthPosts(ctx);
        }
        const processedList = [];
        const {list, count} = await this.getList(ctx);
        for (const item of list) {

            const processedItem = Object.assign({
                comments: {
                    list: [],
                    count: 0,
                    limit: 3
                },
                userReactions: 'none'
            }, item._doc);

            let comments = await Comment.find({
                'post._id': item._id
            })
            .populate('user', 'name lastName surname email avatar')
            .select(types['comment'].fields)
            .limit(3).sort('-createdAt');
            comments = comments.reverse();

            processedItem.comments.list = comments;
            processedItem.comments.count = await Comment.count({'post._id': item._id});

            if (processedItem.ifQuestionary) {
                processedItem['userQuestionaryAnswer'] = null;
                const userAnswer = processedItem.questionaryResult.find(el => el.user._id === ctx.user._id);
                if (userAnswer) {
                    processedItem['userQuestionaryAnswer'] = userAnswer.answer;
                }
            } else {
                delete processedItem['questionary'];
            }

            if (processedItem.reactionsResults.like.indexOf(ctx.user._id) > -1) {
                processedItem.userReactions = 'like';
            } else if (processedItem.reactionsResults.dislike.indexOf(ctx.user._id) > -1) {
                processedItem.userReactions = 'dislike';
            }

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

    listNoAuthPosts = async (ctx) => {
        const processedList = [];
        const { list, count } = await this.getList(ctx);
        for (const item of list) {

            const processedItem = Object.assign({
                comments: {
                    list: [],
                    count: 0,
                    limit: 3
                }
            }, item._doc);

            let comments = await Comment.find({
                'post._id': item._id
            })
            .select(types['comment'].fields)
            .populate('user', 'name lastName surname email avatar')
            .limit(3).sort('-createdAt');
            comments = comments.reverse();

            processedItem.comments.list = comments;
            processedItem.comments.count = await Comment.count({ 'post._id': item._id });

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

    commentPost = async (ctx) => {
        const post = await this.model.findById(ctx.params.id);
        if (! post) {
            throw {
                result: false,
                message: 'Такого поста не существует',
                code: 404,
            };
        }

        const item = new Comment({
            body: ctx.request.body.body,
            user: ctx.user._id,
            post
        });

        await item.save();

        ctx.body = {
            result: true,
            data: item
        };
    }

    likePost = async (ctx) => {
        const post = await this.model.findById(ctx.params.id);
        if (! post) {
            throw {
                result: false,
                message: 'Такого поста не существует',
                code: 404,
            };
        }

        if (post.reactionsResults.like.indexOf(ctx.user._id) > -1) {
            throw {
                result: false,
                message: 'Вы уже оценили этот пост',
                code: 400,
            };
        }

        if (post.reactionsResults.dislike.indexOf(ctx.user._id) > -1) {
            throw {
                result: false,
                message: 'Вы уже оценили этот пост',
                code: 400,
            };
        }

        post.reactions.like ++;
        post.reactionsResults.like.push(ctx.user._id);

        await post.save();

        ctx.body = {
            result: true
        };
    }

    dislikePost = async (ctx) => {
        const post = await this.model.findById(ctx.params.id);
        if (! post) {
            throw {
                result: false,
                message: 'Такого поста не существует',
                code: 404,
            };
        }

        if (post.reactionsResults.like.indexOf(ctx.user._id) > -1) {
            throw {
                result: false,
                message: 'Вы уже оценили этот пост',
                code: 400,
            };
        }

        if (post.reactionsResults.dislike.indexOf(ctx.user._id) > -1) {
            throw {
                result: false,
                message: 'Вы уже оценили этот пост',
                code: 400,
            };
        }

        post.reactions.dislike ++;
        post.reactionsResults.dislike.push(ctx.user._id);

        await post.save();

        ctx.body = {
            result: true
        };
    }

    postAnswerQuestionary = async (ctx) => {
        const post = await this.model.findById(ctx.params.id);
        if (!post) {
            throw {
                result: false,
                message: 'Такого поста не существует',
                code: 404,
            };
        }

        if (!post.ifQuestionary) {
            throw {
                result: false,
                message: 'В посте нет опроса',
                code: 400,
            };
        }

        if (!ctx.request.body.id) {
            throw {
                result: false,
                message: 'Не указан вариант ответа',
                code: 400,
            };
        }

        const answer = post.questionary.answers.find(el => el.id === ctx.request.body.id);
        if (!answer) {
            throw {
                result: false,
                message: 'Неверный вариант ответа',
                code: 400,
            };
        }

        const existAnswer = post.questionaryResult.find(el => el.user._id === ctx.user._id);

        if (existAnswer) {
            throw {
                result: false,
                message: 'Вы уже ответили на этот опрос',
                code: 400,
            };
        }

        post.questionaryResult.push({
            answer,
            user: ctx.user,
        });

        answer.answerCount ++;

        await post.save();

        ctx.body = {
            result: true
        };
    }

}
