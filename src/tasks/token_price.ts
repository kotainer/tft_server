import * as User from '../models/user';
import * as TokenRate from '../models/tokenRate';
import * as TokenList from '../models/tokenList';
import * as moment from 'moment';


export class CollectTokenPrice {
    private request = require('request');
    private neededTokens = [
        'BTC',
        'ETH',
        'XRP',
        'BCH',
        'ADA'
    ];

    tick = async () => {
        const activeCreases = await new Promise((resolve, reject) => {
            this.request.get('http://api.runico.io:83/api/crease/active', {}, (err, response, body) => {
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

        const prices = await new Promise((resolve, reject) => {
            this.request.get('https://api.coinmarketcap.com/v1/ticker/?limit=1000000', {}, (err, response, body) => {
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

        const ETH_price = prices.find(el => el.symbol === 'ETH');
        const BTC_price = prices.find(el => el.symbol === 'BTC');

        await TokenList.remove({});

        for (const token of activeCreases) {
            const tokenElem = token.tokenPrice.split(' ').filter(el => el !== '' && el !== '=');

            const tokenName = tokenElem[1];
            const tokenEqName = tokenElem[3];

            const finded = prices.find(el => el.symbol === tokenName);
            const findedEq = prices.find(el => el.symbol === tokenEqName);

            let todayPrice = 0;
            let todayPriceList = null;

            if (finded) {
                todayPrice = Number.parseFloat(finded.price_usd);
                todayPriceList = todayPrice;
            } else {
                todayPrice = (Number.parseFloat(tokenElem[2]) * Number.parseFloat(findedEq.price_usd))
                    / Number.parseFloat(tokenElem[0]);

            }

            const tempPrice = (Number.parseFloat(tokenElem[2]) * Number.parseFloat(findedEq.price_usd))
                / Number.parseFloat(tokenElem[0]);

            const buyPrice = (1 - Number.parseFloat(token.startBonus) / 100) * tempPrice;

            await new TokenRate({
                token: tokenName,
                tokenEqName,
                todayPrice,
                buyPrice,
                tokenPrice: token.tokenPrice
            }).save();

            await new TokenList({
                avatar: token.avatar,
                name: token.name,
                id: token.id,
                creaseEndDate: token.creaseEndDate,
                creaseStartDate: token.creaseStartDate,
                tokenPrice: token.tokenPrice,
                startBonus: token.startBonus,
                todayPrice: todayPriceList,
                btcPrice: BTC_price.price_usd,
                ethPrice: ETH_price.price_usd
            }).save();
        }

        console.log('Обновили цену токенов за день');
    }
}
