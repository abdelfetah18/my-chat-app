const route_protection = require("./route_protection");
const sign_in = require("./sign_in");
const user = require("./user/index");
const room = require("./room/index");

const upload_image = require("./upload_image");
const app = require("express").Router();

let multer = require('multer');
let image = multer({ dest:'./uploads/upload_images' });

// NOTE: When adding new routes, add it before '/' route.
app.use('/sign_in', sign_in);
app.use('/user', user);
app.use('/room', room);
app.use('/', route_protection);

app.post("/upload_image", image.single('upload_image'), upload_image);

module.exports = app;