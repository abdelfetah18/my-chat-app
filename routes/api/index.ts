import route_protection from './route_protection';
import sign_in from './sign_in';
import user from './user/index';
import room from './room/index';
import upload_image from './upload_image';
import { Router } from 'express';

const app = Router();

let multer = require('multer');
let image = multer({ dest:'./uploads/upload_images' });

// NOTE: When adding new routes, add it before '/' route.
app.use('/sign_in', sign_in);
app.use('/user', user);
app.use('/room', room);
app.use('/', route_protection);

app.post("/upload_image", image.single('upload_image'), upload_image);

export default app;