import { Chats } from './../api/client/chats';
import { createServer, Server } from 'http';
import * as Koa from 'koa';
import * as socketIo from 'socket.io';
import * as chalk from 'chalk';

import * as moment from 'moment';
import * as User from '../models/user';
import * as Admin from '../models/admin';
import * as Chat from '../models/chat';

const jwt = require('jsonwebtoken'); // аутентификация  по JWT для hhtp
const jwtsecret = 'LKlkaerKawfCashnprettygoodsecurekey'; // ключ для подписи JWT

export class ChatServer {
    public static readonly PORT: number = 7002;
    private app: any;
    private server: Server;
    private io: SocketIO.Server;
    private port: string | number;
    private users = {};

    private TYPES = {
        INIT: 0,
        MESSAGE: 1
    };

    private MESSAGES_TYPES = {
        TEXT_MESSAGE: 0
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
                this.sendMessageInChat(socket, m);
            });

            socket.on('init', (m: any) => {
                this.initUser(socket, m);
            });

            socket.on('disconnect', () => {
                this.disconnectUser(socket);
                console.log('Client disconnected');
            });
        });
    }

    public getServer(): any {
        return this.server;
    }

    private decodedToken = async (token) => {
        const decoded: any = await new Promise((resolve) => {
            jwt.verify(token.replace('JWT ', ''), jwtsecret, (err, info) => {
                if (info) {
                    if (moment(info.expireAt) < moment()) {
                        return resolve(false);
                    }
                    return resolve(info);
                }
                return resolve(false);
            });
        });

        return decoded;
    };

    private initUser = async (socket, token) => {
        const tokenInfo = await this.decodedToken(token);
        let user;
        if (!tokenInfo) {
            socket.send({
                result: false,
                message: 'Токен недействителен',
            });
        }

        if (tokenInfo.isAdmin) {
            user = await Admin.findById(tokenInfo.id);
        } else {
            user = await User.findById(tokenInfo.id);
        }

        socket.user = user;
        socket.isAdmin = tokenInfo.isAdmin;

        if (!this.users[user._id]) {
            this.users[user._id] = []
        }
        
        const exists = this.users[user._id].find(el => el.id === socket.id);

        if(!exists) {
            this.users[user._id].push(socket);
        }

        socket.send({
            result: true,
            type: this.TYPES.INIT
        });
    }

    private disconnectUser = async (socket) => {

    }

    private sendMessageInChat = async (socket, message) => {
        try {
            const chat = await Chat.findById(message.chatId).lean() as any;
            if (!chat) {
                socket.send({
                    result: false,
                    message: 'Чат не найден'
                })
            }

            const inChat = chat.users.find(el => el._id === socket.user._id);
            if (!inChat) {
                socket.send({
                    result: false,
                    message: 'Пользователь не является участником данного чата'
                })
            }

            chat.messages.push({
                sender: socket.user._id,
                content: message.content
            });

            for (const receiver of chat.users) {
                if (receiver._id !== socket.user._id) {
                    if (!chat.newMessagesCount[receiver._id]) {
                        chat.newMessagesCount[receiver._id] = 0;
                    }

                    chat.newMessagesCount[receiver._id]++;
                }

                const receiverSockets = this.users[receiver._id];
                if (!receiverSockets) {
                    continue;
                }

                for (const receiverSocket of receiverSockets) {
                    try {
                        receiverSocket.send({
                            result: true,
                            type: this.TYPES.MESSAGE,
                            data: {
                                sender: {
                                    _id: socket.user._id,
                                    name: `${socket.user.lastname || ''} ${socket.user.name || ''}`,
                                    avatar: socket.user.avatar || ''
                                },
                                content: message.content,
                                chatId: chat._id,
                                type: this.MESSAGES_TYPES.TEXT_MESSAGE
                            }
                        })
                    } catch (e) {
                        console.error(e);
                    }
                }
            }

            await Chat.update({_id: chat._id}, chat);
            // await chat.save();
        } catch (e) {
            console.error(e);
        }
    }
}