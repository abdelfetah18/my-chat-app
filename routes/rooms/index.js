const room_by_id = require("./room_by_id");
const app = require("express").Router();

app.use('/:room_id', room_by_id);

module.exports = app;