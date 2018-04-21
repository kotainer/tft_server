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
        const main = await this.tftApi.getMainInfo();
        const last5 = await this.tftApi.getLastBlocks(5);

        if (!main || !last5 || !last5.length) {
            return;
        }

        this.socketService.sendTick({
            lastBlock: {
                id: main.blockid,
                height: main.height,
                difficulty: main.difficulty,
                timeStamp: main.maturitytimestamp,
                activeBlockStake: main.estimatedactivebs
            },
            lastBlocks: last5
        })
    }

}
