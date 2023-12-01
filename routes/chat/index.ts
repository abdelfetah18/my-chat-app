import chat_by_id from './chat_by_id';
import { Router } from 'express';
const app = Router();

app.use('/:chat_id', chat_by_id);

export default app;