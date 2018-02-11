const URL = require('url');
const fetch = require('node-fetch');
const FormData = require('form-data');
const _ = require('lodash');
const request = require('request');

export class API {
    url: string;

    constructor(url: string) {
        this.url = url;
    }

    register = (form: object) => {
        return new Promise((resolve) => {
            request.post(`${this.url}/auth/register`, {form}, (err, response, body) => {
                const result = JSON.parse(body);
                resolve(result);
            });
        });
    }

    login = (form: object) => {
        return new Promise((resolve) => {
            request.post(`${this.url}/auth/login`, {form}, (err, response, body) => {
                const result = JSON.parse(body);
                resolve(result);
            });
        });
    }

    validate = (token: string) => {
        return new Promise((resolve) => {
            const options = {
                url: `${this.url}/auth/validate`,
                mathod: 'POST',
                headers: {
                    'Authorization': token,
                }
            };

            function callback(error, response, body) {
                if (!error && response.statusCode === 200) {
                    const result = JSON.parse(body);
                    resolve(result);
                } else {
                    resolve({});
                }
            }

            request(options, callback);
        });
    }
}
