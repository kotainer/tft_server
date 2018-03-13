import * as Shop from '../models/shop';

const request = require('request');

export class AdmitadIntegrationService {
    private accessToken = '';
    private w_id = '563403';

    authAdmitad = async () => {
        const clientId = '11340930f605a092fb4f9100b8488e';
        const clientSecret = 'b7aa0d8269d8604b098e21aa388acd';
        const authUrl = `https://api.admitad.com/token/?grant_type=client_credentials&client_id=${clientId}&scope=advcampaigns arecords banners websites advcampaigns_for_website statistics coupons_for_website private_data_balance deeplink_generator coupons advcampaigns`
        const auth = 'MTEzNDA5MzBmNjA1YTA5MmZiNGY5MTAwYjg0ODhlOmI3YWEwZDgyNjlkODYwNGIwOThlMjFhYTM4OGFjZA==';

        const data =  await this.sendRequest('POST', authUrl, {}, {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json'
        }) as any;

        this.accessToken = data.access_token;

        return;
    }

    isJsonString = (str) => {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    sendRequest = async (method, url, data, headers) => {
        console.log('Отправили запрос');
        return new Promise((resolve, reject) => {
            request({ method, url, headers }, (error, response, body) => {
                console.log('Пришел ответ');
                if (error) {
                    console.log(error)
                    reject(Error(error));
                } else {
                    if (this.isJsonString(body)) {
                        resolve(JSON.parse(body));
                    } else {
                        resolve({});
                    }
                        
                };
            });
        });
    }

    synchronizeOrder = async () => {
        console.log('Запуск синхронизации заказов');
        await this.authAdmitad();

        let limit = 20;
        let offset = 0;

        let count = 0
        let countUpdate = 0

        const date = new Date()
        const curr_date = date.getDate()
        const curr_month = date.getMonth() + 1
        const curr_year = date.getFullYear()
        const urlParams = `start_date=04.01.2017&end_date=${curr_date}.${curr_month}.${curr_year}&action_type=2`;

            // request {
            //     method: 'GET'
            //   url: "https://api.admitad.com/statistics/actions/?#{urlParams}&limit=#{limit}&offset=#{offset}"
            //   headers: 'Authorization': "Bearer #{access_token}"
            // }, (error, response, body) ->
    }

    synchronizeShops = async () => {
        console.log('Запуск синхронизации магазинов');
        await this.authAdmitad();

        let limit = 1;
        let offset = 0;

        let count = 0;
        let countUpdated = 0;
        let countAdded = 0;

        let urlShops = `https://api.admitad.com/advcampaigns/website/${this.w_id}/?limit=1`;

        const shopsCount = await this.sendRequest('GET', urlShops, {}, {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
        }) as any;

        // console.log(shopsCount);
        if (shopsCount._meta && shopsCount._meta.count) {
            limit = 80;
            count = shopsCount._meta.count;
            while (offset < count) {
                urlShops = `https://api.admitad.com/advcampaigns/website/${this.w_id}/?limit=${limit}&offset=${offset}`;
                const shops = await this.sendRequest('GET', urlShops, {}, {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                }) as any;

                for (const shop of shops.results) {
                    let current = await Shop.findOne({ admitadId: shop.id });
                    
                    if (!current) {
                        current = new Shop({
                            admitadId: shop.id,
                            isAdmitad: true,
                            name: shop.name,
                            description: shop.description,
                            rawDescription: shop.raw_description,
                            categories: shop.categories.map(el => el.name)
                        });

                        countAdded++;
                    } else {
                        countUpdated++;
                    }

                    if (shop.connection_status && shop.connection_status === 'active') {
                        current.isActive = true;
                    } else {
                        current.isActive = false;
                    }

                    current.regions = shop.regions.map(el => el.region);
                    current.siteUrl = shop.site_url;
                    current.avgHoldTime = shop.avg_hold_time;
                    current.nameAliases = shop.name_aliases;
                    current.avgMoneyTransferTime = shop.avg_money_transfer_time;
                    current.actions = shop.actions;
                    current.currency = shop.currency;
                    current.image = shop.image;
                    current.rating = Number.parseFloat(shop.rating);
                    current.gotoLink = shop.gotolink;

                    current.updatedAt = new Date();

                    await current.save();
                }

                offset += limit;
                console.log('offset ', offset);
            }
        }
        
        console.log('Завершили обработку магазинов');
        console.log('Обновлено', countUpdated);
        console.log('Добавлено', countAdded);
        console.log('Обработано', count);
    }
}

