import { TftApiService } from '../../services/tftAPI.service'

export class Blocks {
    private tftApi;

    constructor() {
        this.tftApi = new TftApiService();
    }


    getLastInfo = async (ctx) => {
        const main = await this.tftApi.getMainInfo();
        const last5 = await this.tftApi.getLastBlocks(5);

        ctx.body = {
            result: true,
            data: {
                lastBlock: {
                    id: main.blockid,
                    height: main.height,
                    difficulty: main.difficulty,
                    timeStamp: main.maturitytimestamp,
                    activeBlockStake: main.estimatedactivebs
                },
                lastBlocks: last5
            }
        }
    }

    getByHeigth = async (ctx) => {
        const block = await this.tftApi.getBlockById(ctx.params.id);

        if (!block || block.message) {
            return ctx.body = {
                result: false,
                message: 'Invalid block id'
            }
        }

        ctx.body = {
            result: true,
            data: block
        }
    }
}
