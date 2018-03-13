import { AdmitadIntegrationService } from '../services/admitad';

const cron = require('node-cron');
const chalk = require('chalk');

const admitad = new AdmitadIntegrationService();

export class Tasks {
    runTasks = () => {
        // this.syncShops();
    }

    syncOrder = () => {
        admitad.synchronizeOrder();
    }

    syncShops = () => {
        cron.schedule('1 1 * * *', function () {
            admitad.synchronizeShops();
        });
    }
};
