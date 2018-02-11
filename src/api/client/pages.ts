const pug = require('pug');
const appRootDir = require('app-root-dir').get();

import * as User from '../../models/user';
import * as Log from '../../models/log';
import * as Settings from '../../models/settings';

import * as moment from 'moment';

const env = process.env.NODE_ENV || 'prod';

const crud = {
    landing: async (ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        if (env === 'localDev') {
            ctx.body = await pug.renderFile(appRootDir + '/views/client/index_dev.pug');
        } else {
            ctx.body = await pug.renderFile(appRootDir + '/views/client/index.pug');
        }
    }
};
export default crud;
