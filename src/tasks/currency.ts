import { CurrencyService } from './../services/currency.service';
import * as Rate from '../models/rate';

export class Curency {
    private currencyService

    constructor() {
        this.currencyService = new CurrencyService();
    }

    updateCurrencyInfo = async () => {
        const coinPrice = await this.currencyService.getCoinPrice('BTC');
        const euroRate = await this.currencyService.getEuroRate('USD');

        const rate = new Rate({
            prices: {
                btcToUsd: coinPrice,
                eurToUsd: euroRate
            }
        });

        await rate.save();
    }
}