const cron = require('node-cron');
const chalk = require('chalk');

import { Tick } from './tick';

export class Tasks {
    private tick = new Tick();
    runTasks = () => {
        this.runTick();
    }

    runTick = () => {
        cron.schedule('*/5 * * * * * *', () => {
            this.tick.sendTickData();
        });

        if (process.env.NODE_ENV === 'dev') {
            console.log(chalk.white.bgBlue.bold('[tasks] Задача обновления eth транзакций'));
        }
        
    }
};