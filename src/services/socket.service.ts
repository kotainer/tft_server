import { createServer, Server } from 'http';
import * as Koa from 'koa';
import * as socketIo from 'socket.io';
import * as chalk from 'chalk';

import * as moment from 'moment';

const config = require('config');

export class SocketServer {
    public static readonly PORT: number = config.get('wsPort');
    private app: any;
    private server: Server;
    private io: SocketIO.Server;
    private port: string | number;
    private users = [];

    private TYPES = {
        INIT: 0,
        MESSAGE: 1,
        TICK: 2
    };

    constructor() {
        this.config();
        this.createApp();
        this.createServer();
        this.sockets();
        this.listen();
    }

    private createApp(): void {
        this.app = new Koa();
    }

    private createServer(): void {
        this.server = require('http').createServer(this.app.callback())
    }

    private config(): void {
        this.port = process.env.PORT || SocketServer.PORT;
    }

    private sockets(): void {
        this.io = socketIo(this.server);
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log(chalk.blue.bold(`Сервер сокетов запущен на ${this.port};`));
        });

        this.io.on('connect', (socket: any) => {
            console.log('Connected client on port %s.', this.port);
            socket.on('init', (m: any) => {
                this.initUser(socket);
            });

            socket.on('disconnect', () => {
                // this.disconnectUser(socket);
                console.log('Client disconnected');
            });
        });
    }

    public sendTick(m: any): void {
        this.io.emit('tick', {
            result: true,
            type: this.TYPES.TICK,
            data: m
        });
    }

    public getServer(): any {
        return this.server;
    }

    private initUser = async (socket) => {
        socket.send({
            result: true,
            type: this.TYPES.INIT
        });

        this.users.push(socket);
    }
}