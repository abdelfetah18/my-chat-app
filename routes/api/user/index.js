const route_protection = require("./route_protection");
const app = require("express").Router();
let multer = require('multer');

const upload_profile_image = require("./upload_profile_image");
const upload_cover_image = require("./upload_cover_image");

let profile_image = multer({ dest:'./uploads/profile_images' });
let cover_image = multer({ dest:'./uploads/cover_images' });

app.use('/', route_protection);

app.post("/upload_profile_image", profile_image.single('profile_image'), upload_profile_image);
app.post("/upload_cover_image", cover_image.single('cover_image'), upload_cover_image);

module.exports = app;