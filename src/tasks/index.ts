
const cron = require('node-cron');
const chalk = require('chalk');

import { Tick } from './tick';
import { Curency } from './currency';

export class Tasks {
    private tick = new Tick();
    private currency = new Curency();

    runTasks = () => {
        this.runTick();
        this.runUpdateCurrency();
    }

    runTick = () => {
        cron.schedule('*/3 * * * * * *', () => {
            this.tick.sendTickData();
        });

        if (process.env.NODE_ENV === 'dev') {
            console.log(chalk.white.bgBlue.bold('[tasks] Задача отправки текущих данных запущена'));
        }
    }

    runUpdateCurrency = () => {
        cron.schedule('*/3 * * * *', () => {
            this.currency.updateCurrencyInfo();
        });

        if (process.env.NODE_ENV === 'dev') {
            console.log(chalk.white.bgBlue.bold('[tasks] Задача обновления курсов запущена'));
        }
    }
};
