import { TftApiService } from '../../services/tftAPI.service'

export class Blocks {
    private tftApi;

    constructor() {
        this.tftApi = new TftApiService();
    }


    getLastInfo = async (ctx) => {
        const main = await this.tftApi.getMainInfo();
        const last5 = await this.tftApi.getLastBlocks(5);

        if (!main || !last5 || !last5.length) {
            return ctx.body = {
                result: true,
                message: 'Node not synced'
            };
        }

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
        const id = Number.parseInt(decodeURIComponent(ctx.params.id));
        if (!id) {
            return ctx.body = {
                result: false,
                message: 'Invalid block id'
            } 
        }

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
