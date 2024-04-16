const Koa = require('koa');
const cors = require('@koa/cors');
const passport = require('koa-passport');
const app = new Koa();

app.use(cors());

app.use(passport.initialize());

const recipes = require('./routes/recipes.js');
const users = require('./routes/users.js');

app.use(recipes.routes());
app.use(users.routes());

module.exports = app;