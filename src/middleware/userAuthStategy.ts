const passport = require('koa-passport'); // реализация passport для Koa
const LocalStrategy = require('passport-local'); // локальная стратегия авторизации
const JwtStrategy = require('passport-jwt').Strategy; // авторизация через JWT
const ExtractJwt = require('passport-jwt').ExtractJwt; // авторизация через JWT

const jwtsecret = 'sarafanprettygoodsecurekey'; // ключ для подписи JWT
const jwt = require('jsonwebtoken'); // аутентификация  по JWT для hhtp
// const socketioJwt = require('socketio-jwt'); // аутентификация  по JWT для socket.io

import * as User from '../models/user';
import * as Admin from '../models/admin';

import * as moment from 'moment';

passport.use(new LocalStrategy({
  passReqToCallback : true,
  usernameField: 'login',
  passwordField: 'password',
  session: false
},
  function (req, login, password, done) {
    let model: any;
    if (req.body.type && req.body.type === 'admin') {
      model = Admin;
    } else {
      model = User;
    }

    login = login.trim();

    model.findOne({ login }, (err, user) => {
      if (err) {
        return done(err);
      }

      if (!user || !user.checkPassword(password)) {
        return done({ message: 'Нет такого пользователя или пароль неверен.' }, null);
      }
      return done(null, user);
    });
  }
)
);

// ----------Passport JWT Strategy--------//

// Ждем JWT в Header

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: jwtsecret
};

passport.use(new JwtStrategy(jwtOptions, (payload, done) => {
  let model: any;

  if (!payload.expireAt || new Date(payload.expireAt) <= new Date()) {
    return done(null, false);
  }

  if (payload.isAdmin) {
    model = Admin;
  } else {
    model = User;
  }

  model.findById(payload.id, '-passwordHash -salt -siteBalances -parent', (err, user) => {
    if (err) {
      return done(err);
    }
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  });
})
);

export default passport;
