const chat_by_id = require("./chat_by_id");
const app = require("express").Router();

app.use('/:chat_id', chat_by_id);

module.exports = app;