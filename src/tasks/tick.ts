import { TftApiService } from '../services/tftAPI.service'
import { SocketServer } from '../services/socket.service';

export class Tick {
    private socketService;
    private tftApi;

    constructor() {
        this.socketService = new SocketServer();
        this.tftApi = new TftApiService();
    }

    sendTickData = async () => {
        const current = await this.tftApi.getCurrentInfo();

        if (!current) {
            return;
        }

        try {
            this.socketService.sendTick({
                lastBlock: {
                    id: current.blockid,
                    height: current.height,
                    parentId: current.rawblock.parentid,
                    difficulty: current.difficulty,
                    timeStamp: current.maturitytimestamp,
                    activeBlockStake: current.estimatedactivebs,
                    transactionsCount: current.transactions.length
                }
            })
        } catch (e) {
            console.error(e);
        }
        
    }

}
