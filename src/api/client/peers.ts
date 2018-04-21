import { TftApiService } from '../../services/tftAPI.service'

export class Peers {
    private tftApi;
    private geoip;

    constructor() {
        this.tftApi = new TftApiService();
        this.geoip = require('geoip-lite')
    }


    listPeers = async (ctx) => {
        const list = (await this.tftApi.getPeers()).peers;

        for (const peer of list) {
            const geo = this.geoip.lookup(peer.netaddress.split(':')[0]);
            peer['geo'] = {
                country: geo.country,
                coordinates: geo.ll || [0, 0]
            };
        }

        ctx.body = {
            result: true,
            data: list
        }
    }

}
