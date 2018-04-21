const Router = require('koa-router');
const router = new Router({ prefix: '/api/v1' });

import { Blocks } from './blocks';
import { Hashes } from './hashes';

const block = new Blocks();
const hashes = new Hashes();

router
    // BLOCKS
    .get('/block', block.getLastInfo)

    .get('/block/:id', block.getByHeigth)
    // -----------------------------------------------

    // HASH
    .get('/hashes/:hash', hashes.findHash)
    // -----------------------------------------------

    ;

export default router;
