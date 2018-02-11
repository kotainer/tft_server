import { Crud } from '../crud-service';
import * as settingsModel from '../../models/settings';

export class Settings extends Crud {
    constructor(model: any, type: string) {
        super(model, type);
    }

    async getSettingsByTag (ctx) {
        const item = await settingsModel.findOne({tag: ctx.params.tag});
        ctx.body = {
            result: true,
            data: item
        };
    };
}
