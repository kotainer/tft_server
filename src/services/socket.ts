import { createServer, Server } from 'http';
import * as Koa from 'koa';
import * as socketIo from 'socket.io';
import * as chalk from 'chalk';

export class ChatServer {
    public static readonly PORT: number = 7002;
    private app: any;
    private server: Server;
    private io: SocketIO.Server;
    private port: string | number;

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
        this.port = process.env.PORT || ChatServer.PORT;
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
            socket.on('message', (m: any) => {
                console.log('[server](message): %s', JSON.stringify(m));
                this.io.emit('message', m);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
    }

    public getServer(): any {
        return this.server;
    }
}