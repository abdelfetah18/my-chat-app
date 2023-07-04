const user_by_id = require("./user_by_id");
const app = require("express").Router();

app.use('/:user_id', user_by_id);

module.exports = app;