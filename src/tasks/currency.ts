import { CurrencyService } from './../services/currency.service';

export class Curency {
    private currencyService

    constructor() {
        this.currencyService = new CurrencyService();
    }

    updateCurrencyInfo = async () => {
        await this.currencyService.getCoinPrice('BTC');
        await this.currencyService.getEuroRate('USD');
    }
}