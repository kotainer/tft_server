const nodemailer = require('nodemailer');
const pug = require('pug');
const appRootDir = require('app-root-dir').get();
const config = require('config');

import * as Settings from '../models/settings';

export class Mailer {
    /**
     * Отправка письмо о регистрации
     * @param {User} receiver пользователь, который зарегался
     */
    async sendRegisterMail(receiver: any) {
        const settings = await Settings.findOne({tag: 'main'});
        const emailSettings = settings.body.email;

        const html = await pug.renderFile(appRootDir + '/views/mails/register.pug', {
            receiver,
            settings: emailSettings
        });

        const mailOptions = {
            from: `"${emailSettings.hostName}" <${emailSettings.senderEmail}>`,
            to: receiver.email,
            subject: `Добро пожаловать в ${emailSettings.hostName}!`,
            html: html,
        };

        const transporter = nodemailer.createTransport({
            host: emailSettings.smtpHost,
            port: emailSettings.smtpPort,
            secure: true,
            auth: {
                user: emailSettings.senderEmail,
                pass: emailSettings.senderPassword,
            },
            dkim: {
                domainName: emailSettings.dkimDomainName,
                keySelector: emailSettings.dkimKeySelector,
                privateKey: emailSettings.dkimPrivateKey
            },
        });

        return transporter.sendMail(mailOptions, (error, info) => {
            return console.log(error, info);
        });
    }

    /**
     * Отправка письма с востановленным паролем
     * @param {User} receiver пользователь
     * @param {String} newPass сгенерированный пароль
     */
    async sendRestorePassMail(receiver: any, newPass: string) {
        const settings = await Settings.findOne({tag: 'main'});
        const emailSettings = settings.body.email;

        const html = await pug.renderFile(appRootDir + '/views/mails/restore.pug', {
            receiver,
            newPass,
            settings: emailSettings
        });

        const mailOptions = {
            from: `"${emailSettings.hostName}" <${emailSettings.senderEmail}>`,
            to: receiver.email,
            subject: `Восстановление пароля!`,
            html: html,
        };

        const transporter = nodemailer.createTransport({
            host: emailSettings.smtpHost,
            port: emailSettings.smtpPort,
            secure: true,
            auth: {
                user: emailSettings.senderEmail,
                pass: emailSettings.senderPassword,
            },
            dkim: {
                domainName: emailSettings.dkimDomainName,
                keySelector: emailSettings.dkimKeySelector,
                privateKey: emailSettings.dkimPrivateKey
            },
        });

        return transporter.sendMail(mailOptions, (error, info) => {
            return console.log(error, info);
        });
    }
};
