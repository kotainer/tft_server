import * as Shop from '../../models/shop';

export class Categories{
    constructor() {
    }

    popular = async (ctx) => {
        const list = [];
        const counted = {};
        const shops = await Shop.find({}).lean() as any;

        for (const shop of shops) {
            if (!shop.categories) {
                continue;
            }

            for (const cat of shop.categories) {
                if (!counted[cat]) {
                    counted[cat] = 0;
                }
                counted[cat] ++;
            }
        }

        for (const prop in counted) {
            if (counted.hasOwnProperty(prop)) {
                list.push({
                    name: prop,
                    count: counted[prop]
                })
            }
        }

        list.sort((a, b) => {
            if (a.count > b.count) {
                return -1;
            }

            if (a.count < b.count) {
                return 1;
            }

            return 0;
        });

        ctx.body = {
            result: true,
            data: {
                list: list.slice(0, 30),
                count: 30
            }
        };
    }

    list = async (ctx) => {
        const list = [];
        const counted = {};
        const shops = await Shop.find({}).lean() as any;

        for (const shop of shops) {
            if (!shop.categories) {
                continue;
            }

            for (const cat of shop.categories) {
                if (!counted[cat]) {
                    counted[cat] = 0;
                }
                counted[cat]++;
            }
        }

        for (const prop in counted) {
            if (counted.hasOwnProperty(prop)) {
                list.push({
                    name: prop,
                    count: counted[prop]
                })
            }
        }

        list.sort((a, b) => {
            if (a.count > b.count) {
                return -1;
            }

            if (a.count < b.count) {
                return 1;
            }

            return 0;
        });

        ctx.body = {
            result: true,
            data: {
                list,
                count: list.length
            }
        };
    }
    
}
