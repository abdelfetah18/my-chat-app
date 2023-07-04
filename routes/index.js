let api = require("./api/index");
let rooms = require("./rooms/index");
let chat = require("./chat/index");
const route_protection = require("./route_protection");
const user = require("./user/index");
const app = require("express").Router();

app.use('/api/v1', api);
app.use('/rooms', rooms);
app.use('/chat', chat);
app.use('/user', user);
app.use('/', route_protection);

module.exports = app;