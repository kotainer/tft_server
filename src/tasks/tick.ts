import { CurrencyService } from './../services/currency.service';
import { TftApiService } from '../services/tftAPI.service'
import { SocketServer } from '../services/socket.service';

export class Tick {
    private socketService;
    private tftApi;
    private currencyService;

    constructor() {
        this.socketService = new SocketServer();
        this.tftApi = new TftApiService();
        this.currencyService = new CurrencyService;
    }

    sendTickData = async () => {
        const current = await this.tftApi.getCurrentInfo();

        if (!current) {
            return;
        }

        const { coinPrice, currencyRate } = await this.currencyService.getLastInfo('BTC', 'USD');

        try {
            this.socketService.sendTick({
                lastBlock: {
                    id: current.blockid,
                    height: current.height,
                    parentId: current.rawblock.parentid,
                    difficulty: current.difficulty,
                    timeStamp: current.maturitytimestamp,
                    activeBlockStake: current.estimatedactivebs,
                    transactionsCount: current.transactions.length,
                    minerReward: current.rawblock.minerpayouts.reduce((prev, current) => {
                        return prev + Number.parseInt(current.value);
                    }, 0)
                },
                currency: {
                    btcUsd: coinPrice,
                    usdEur: currencyRate
                }
            })
        } catch (e) {
            console.error(e);
        }
        
    }

}
