const pug = require('pug');
const appRootDir = require('app-root-dir').get();

import * as User from '../../models/user';
import * as Log from '../../models/log';

import * as mongoose from 'mongoose';
import { Crud } from '../crud-service';

const env = process.env.NODE_ENV || 'prod';

export class AdminPages extends Crud {

    async main (ctx) {
        ctx.set('Access-Control-Allow-Origin', '*');
        if (env === 'localDev') {
            ctx.body = await pug.renderFile(appRootDir + '/views/cms/index_dev.pug');
        } else {
            ctx.body = await pug.renderFile(appRootDir + '/views/cms/index.pug');
        }
    };

};
