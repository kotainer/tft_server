import types from '../utils/entryTypes';

import * as _ from 'lodash';
import * as moment from 'moment';
import * as asyncBusboy from 'async-busboy';

const uuid = require('uuid');
const fs = require('fs');
const fse = require('fs-extra');
const appRootDir = require('app-root-dir').get();
const config = require('config');

export class Crud {
    model: any;
    entryType: string;

    constructor(model: any, entryType: string) {
        this.model = model;
        this.entryType = entryType;
    }

    /**
     * Создание нового элемента
    */
    create = async (ctx) => {
        let item;
        if (ctx.headers['content-type'].indexOf('multipart/form-data;') > -1) {
            const {fields, files} = await asyncBusboy(ctx.req);
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

    /**
     * Удаление элемента
     * @param {String} id идентификатор объекта
     */
    delete = async (ctx, next) => {
        const existItem = await this.model.findById(ctx.params.id);
        if (!existItem) {
            return ctx.body = {
                result: false,
                note: `Элемента с id ${ctx.params.id} не существует`,
                code: 404
            };
        }

        const result = await this.model.remove({ _id: ctx.params.id });
        ctx.body = {
            result: true,
            data: result
        };
    }

    /**
     * Получение элемента по идинтификатору.
     * Популяция по внутренним полям
     * @param {String} id идентификатор объекта
     */
    show = async (ctx, next) => {
        const item = await this.model
            .findById(ctx.params.id)
            .select(types[this.entryType].fields)
            .populate(types[this.entryType].populate);

        ctx.body = {
            result: true,
            data: item
        };
    }

    /**
     * Список элементов коллекции. для внутренних методов
     */
    getList = async (ctx) => {
        let query;
        if (ctx.query && ctx.query.query) {
            query = this.normalizeQuery(ctx.query.query);
        }

        let skip = 0;
        if (ctx.query.skip) {
            skip = parseInt(ctx.query.skip, 10);
        }

        let limit = types[this.entryType].countLimit;
        if (ctx.query.limit) {
            limit = parseInt(ctx.query.limit, 10);
        }

        if (types[this.entryType].extendQuery) {
            query = _.extend(query, types[this.entryType].extendQuery);
        }

        let sort = [];
        if (ctx.query.sort) {
            sort = ctx.query.sort.split(',');
        } else {
            sort = types[this.entryType].sort;
        }


        const itemsList = await this.model
            .find(query)
            .select(types[this.entryType].fields)
            .populate(types[this.entryType].populate)
            .sort(sort.toString())
            .skip(skip)
            .limit(limit);

        const itemsCount = await this.model.count(query);

        let fullItems = [];
        if (ctx.fullList) {
            fullItems = await this.model.find(query);
        }

        return {
            list: itemsList,
            fullList: fullItems,
            count: itemsCount,
        };
    }

    /**
     * Список элементов коллекции.
     * Поддержка запроса поиска по полям
     */
    list = async (ctx) => {
        let query;
        if (ctx.query && ctx.query.query) {
            query = this.normalizeQuery(ctx.query.query);
        }

        let skip = 0;
        if (ctx.query.skip) {
            skip = parseInt(ctx.query.skip, 10);
        }

        let limit = types[this.entryType].countLimit;
        if (ctx.query.limit) {
            limit = parseInt(ctx.query.limit, 10);
        }

        if (types[this.entryType].extendQuery) {
            query = _.extend(query, types[this.entryType].extendQuery);
        }

        if (ctx.extendQuery) {
            query = _.extend(query, ctx.extendQuery);
        }

        let sort = [];
        if (ctx.query.sort) {
            sort = ctx.query.sort.split(',');
        } else {
            sort = types[this.entryType].sort;
        }

        const itemsList = await this.model
            .find(query)
            .lean()
            .select(types[this.entryType].fields)
            .populate(types[this.entryType].populate, types[this.entryType].populateSelect)
            .sort(sort.toString())
            .skip(skip)
            .limit(limit);

        const itemsCount = await this.model.count(query);

        ctx.body = {
            result: true,
            data: {
                list: itemsList,
                count: itemsCount,
            }
        };
    }

    /**
     * Обновление объекта
     * @param {String} id идентификатор объекта
     * @param {Object} ctx.request.body список полей
    */
    update = async (ctx, next = null) => {
        let updatedItem;

        if (ctx.headers['content-type'].indexOf('multipart/form-data;') > -1) {
            const {fields, files} = await asyncBusboy(ctx.req);
            updatedItem = fields;
            updatedItem.images = updatedItem.images.concat(await this.attachFiles(files));
        } else {
            updatedItem = ctx.request.body;
        }

        if (updatedItem._id) {
            delete updatedItem._id;
        }

        updatedItem.updatedAt = new Date();
        await this.model.update({ _id: ctx.params.id}, updatedItem);

        const item = await this.model.findById(ctx.params.id).select(types[this.entryType].fields);

        ctx.body = {
            result: true,
            data: item
        };
    }

    normalizeQuery (exportQuery) {
        const query = JSON.parse(exportQuery);

        Object.keys(query).forEach(key => {
            if (typeof query[key] === 'object') {
                Object.keys(query[key]).forEach(subKey => {
                    this.normalizeQueryField(query[key], subKey);
                });
                if (Object.keys(query[key]).length === 0) {
                    delete query[key];
                }
            } else {
                this.normalizeQueryField(query, key);
            }
        });

        return query;
    }

    /**
     * Нормализация полей запроса для поиска по коллекции
     * @param {Object} obj объект запроса
     * @param {String} key поле запроса
     */
    normalizeQueryField (obj, key) {
        if (obj[key] === '' || obj[key] === null) {
            delete obj[key];
        }

        if (obj[key] === 'false') {
            obj[key] = false;
        }

        if (obj[key] === 'true') {
            obj[key] = true;
        }

        if (key === '$or') {
            const orFilds = types[this.entryType].searchOr.map((field) => {
                return { [field]: new RegExp(obj[key], 'i')};
            });
            obj[key] = orFilds;
        }

        if (typeof obj[key] === 'string') {
            const isDate = obj[key].match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);

            if (isDate) {
                obj[key] = moment(obj[key]);
                if (key === '$lte') {
                    obj[key].hour(23).minute(59);
                }
                if (key === '$gte') {
                    obj[key].hour(0).minute(0);
                }
            }
        }

    }

    /**
     * Перемещает и линкует файлы
     * @param {Array} files массив файлов
     */
    attachFiles = async (files) => {
        if (!files || files.length === 0) {
            return;
        }

        const result = [];

        for (const file of files) {
            const newDir = `${appRootDir}/public/img/${types[this.entryType].filePath}`;
            fse.ensureDirSync(newDir);

            const ext = file.path.split('.');
            const newName = `${uuid()}.${ext[ext.length - 1]}`;
            await new Promise(resolve => {
                fs.rename(file.path, `${newDir}/${newName}`, function (err) {
                    if (err) {
                        throw err;
                    }
                    resolve();
                });
            });
            result.push({
                img: `/img/${types[this.entryType].filePath}/${newName}`
            });
        }

        return result;
    }

    generateEscape(count, onlyNumber) {
        let text = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        if (onlyNumber) {
            possible = '0123456789';
        };

        for (let i = 0; i < count; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
};
