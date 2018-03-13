import { AdmitadIntegrationService } from '../services/admitad';

const cron = require('node-cron');
const chalk = require('chalk');

const admitad = new AdmitadIntegrationService();

export class Tasks {
    runTasks = () => {
        this.syncShops();
    }

    syncOrder = () => {
        admitad.synchronizeOrder();
    }

    syncShops = () => {
        cron.schedule('42 20 8 * * *', function () {
            admitad.synchronizeShops();
        });
    }
};
