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
        console.log('Отправили данные')
        const consensus = await this.tftApi.getMainInfo();

        this.socketService.sendTick(consensus)
    }

}
