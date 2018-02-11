import { expect } from 'chai';
import { describe, before } from 'mocha';
import * as testData from '../test-data/strings';

import server from '../../server';
import { API } from '../utils/api';
const api = new API('http://localhost/api');

import * as User from '../../models/user';

describe('Validate token', async () => {
    let user;
    let jwtToken;

    before(async () => {
        user = 'Hi';
        await User.remove({});
    });

    it('register', async () => {
        user = await api.register(testData.values.newUser);

        expect(user.email).to.equal(testData.values.newUser.email);
        expect(user.login).to.equal(testData.values.newUser.login);
        expect(user.photo.medium).to.be.an('object');
    });

    it('login', async () => {
        user = await api.login({
            login: testData.values.newUser.login,
            password: testData.values.newUser.password,
        });

        jwtToken = user.token;
        expect(user.status).to.equal('OK');
        expect(user.isBuisnessOwner).to.equal(false);
        expect(user.token).to.be.an('string');
    });

    it('validate JWT', async () => {
        const response: any = await api.validate(jwtToken);

        expect(response.status).to.equal('OK');
        expect(response.user.login).to.equal(testData.values.newUser.login);
        expect(response.user.email).to.equal(testData.values.newUser.email);
    });

});
