let instance = null;

export class CurrencyService {
    private request;
    private parser;
    private lastInfo;

    constructor() {
        if (!instance) {
            this.request = require('request');
            this.parser = require('xml-parser');
            this.lastInfo = {
                coinPrice: {},
                euroRate: {}
            }

            instance = this;
        }

        return instance;
    }

    getCoinPrice = async (coin: string) => {
        try {
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

            const coinPrice = prices.find(el => el.symbol === coin);

            this.lastInfo.coinPrice['coin'] = Number.parseFloat(coinPrice.price_usd) || 0;

            return Number.parseFloat(coinPrice.price_usd) || 0;
        } catch (e) {
            console.error(e);
            return 0;
        }
    }

    getEuroRate = async (currency: string) => {
        try {
            const rates = await new Promise((resolve, reject) => {
                this.request.get('http://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml', {}, (err, response, body) => {
                    if (err) {
                        resolve([]);
                    } else {
                        try {
                            resolve(this.parser(body));
                        } catch (e) {
                            resolve([]);
                        }
                    };
                });
            }) as any;

            
            const cube = rates.root.children.find(el => el.name === 'Cube');
            const rate = cube.children[0].children.find(el => el.attributes.currency === currency);

            this.lastInfo.euroRate[currency] = Number.parseFloat(rate.attributes.rate);

            return Number.parseFloat(rate.attributes.rate) || 0;
        } catch (e) {
            console.error(e);
            return 0;
        }
    }

    getLastInfo = async (coin: string, currency: string) => {
        let coinPrice = this.lastInfo.coinPrice['coin'];
        if (!coinPrice) {
            coinPrice = await this.getCoinPrice(coin);
            this.lastInfo.coinPrice['coin'] = coinPrice;
        }

        let currencyRate = this.lastInfo.euroRate[currency];
        if (!currencyRate) {
            currencyRate = await this.getEuroRate(currency);
            this.lastInfo.euroRate[currency] = currencyRate;
        }

        return {
            coinPrice,
            currencyRate
        }
    }

}