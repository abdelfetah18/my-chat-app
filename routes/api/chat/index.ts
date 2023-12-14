import route_protection from './route_protection';
import { Router } from 'express';
import send_image from './send_image';
import multer from 'multer';

const app = Router();

let image = multer({ dest:'./uploads/images' });

app.use('/', route_protection);
app.post("/send_image", image.single('image'), send_image);

export default app;