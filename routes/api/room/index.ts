import route_protection from './route_protection';
import upload_cover_image from './upload_cover_image'
import upload_profile_image from './upload_profile_image';
import { Router } from 'express';

const app = Router();

let multer = require('multer');
let upload_room_image = multer({ dest: './uploads/profile_images' });
let upload_room_cover_image = multer({ dest: './uploads/cover_images' });

app.use('/', route_protection);
app.post('/upload_profile_image', upload_room_image.single('profile_image'), upload_profile_image);
app.post('/upload_cover_image', upload_room_cover_image.single('cover_image'), upload_cover_image);

export default app;