const Router = require('koa-router');
const router = new Router({ prefix: '/api/v1' });

import { Blocks } from './blocks';
import { Hashes } from './hashes';
import { Peers } from './peers';
import { Rates } from './rates';

const block = new Blocks();
const hashes = new Hashes();
const peers = new Peers();
const rates = new Rates();

router
    // BLOCKS
    .get('/block', block.getLastInfo)

    .get('/block/:id', block.getByHeigth)
    // -----------------------------------------------

    // HASH
    .get('/hashes/:hash', hashes.findHash)
    // -----------------------------------------------

    // PEERS
    .get('/peers', peers.listPeers)
    // -----------------------------------------------

    // RATES
    .get('/rate', rates.getRateByDate)
    // -----------------------------------------------

    ;

export default router;
