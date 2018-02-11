const cron = require('node-cron');
const chalk = require('chalk');

import { CollectTokenPrice } from './token_price';

export class Tasks {
    runTasks = () => {
        this.getTokensPrice();
    }

    getTokensPrice = () => {
        // new CollectTokenPrice().tick();
        cron.schedule('1 30 18 * * *', () => {
            new CollectTokenPrice().tick();
        });

        console.log(chalk.white.bgBlue.bold('[tasks] Задача сбора стоимости токенов запущена'));
    }
};
