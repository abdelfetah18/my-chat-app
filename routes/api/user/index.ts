import route_protection from './route_protection';
import { Router } from "express";

const app = Router();
import multer from 'multer';

import upload_profile_image from './upload_profile_image';
import upload_cover_image from './upload_cover_image';

let profile_image = multer({ dest:'./uploads/profile_images' });
let cover_image = multer({ dest:'./uploads/cover_images' });

app.use('/', route_protection);

app.post("/upload_profile_image", profile_image.single('profile_image'), upload_profile_image);
app.post("/upload_cover_image", cover_image.single('cover_image'), upload_cover_image);

export default app;