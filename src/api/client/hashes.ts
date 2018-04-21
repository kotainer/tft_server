import { TftApiService } from '../../services/tftAPI.service'

export class Hashes {
    private tftApi;

    constructor() {
        this.tftApi = new TftApiService();
    }


    findHash = async (ctx) => {
        const result = await this.tftApi.findByHash(ctx.params.hash);

        if (!result) {
            return ctx.body = {
                result: false,
                message: 'Invalid hash'
            }
        }

        ctx.body = {
            result: true,
            data: result
        }
    }
}
