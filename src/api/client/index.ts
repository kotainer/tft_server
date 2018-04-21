const Router = require('koa-router');
const router = new Router({ prefix: '/api/v1' });

import { Blocks } from './blocks';
 

const block = new Blocks();

router
    // BLOCKS
    .get('/block/last', block.getLastInfo)

    // -----------------------------------------------

    ;

export default router;
