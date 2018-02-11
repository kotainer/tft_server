import { Crud } from '../crud-service';

import * as User from '../../models/user';
import * as Log from '../../models/log';
import * as TokenList from '../../models/tokenList';

export class TokenPrices extends Crud {
    private request = require('request');

    constructor(model: any, type: string) {
        super(model, type);
    }

    getCurrentPrice = async (ctx) => {
        if (!ctx.query.coins) {
            return ctx.body = {
                result: false,
                note: 'Не указаны монеты'
            };
        }

        const neededTokens = ctx.query.coins.split(';');

        const prices = await new Promise((resolve, reject) => {
            this.request.get('https://api.coinmarketcap.com/v1/ticker/?limit=100', {}, (err, response, body) => {
                if (err) {
                    resolve([]);
                } else {
                    try {
                        resolve(JSON.parse(body));
                    } catch (e) {
                        resolve([]);
                    }
                };
            });
        }) as any;

        const results = [];

        for (const token of neededTokens) {
            const finded = prices.find(el => el.symbol === token);

            if (finded) {
                results.push(finded);
            }
        }

        ctx.body = {
            result: true,
            data: results
        };

    }

    portfolioPrice = async (ctx) => {
        const resultByDate = await this.model.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        day: { $dayOfMonth: '$createdAt' },
                    },
                    coins: {
                        $push: {
                            token: '$token',
                            tokenEqName: '$tokenEqName',
                            todayPrice: '$todayPrice',
                            buyPrice: '$buyPrice',
                            createdAt: '$createdAt'
                        }
                    }
                },
            }
        ]);

        const results = {
            name: 'ROI',
            series: []
        };

        for (const item of resultByDate) {
            let todayPriceSumm = 0;
            let buyPriceSumm = 0;

            for (const coin of item.coins) {
                todayPriceSumm += coin.todayPrice;
                buyPriceSumm += coin.buyPrice;
            }

            console.log(`Расчёт для ${item.coins[0].createdAt}, todayPriceSumm - ${todayPriceSumm}, buyPriceSumm - ${buyPriceSumm}`);

            const profit = ((todayPriceSumm / buyPriceSumm) - 1) * 100;

            results.series.push({
                name: item.coins[0].createdAt,
                value: profit
            });
        }

        ctx.body = {
            result: true,
            data: results
        };
    }

    portfolioList = async (ctx) => {
        const items = await TokenList.find({}).lean() as any;
        ctx.body = {
            result: true,
            data: items
        };

    }
};
