import api from './api/index';
import rooms from './rooms/index';
import chat from './chat/index';
import route_protection from './route_protection';
import user from './user/index';
import { Router } from "express";

const app = Router();

app.use('/api/v1', api);
app.use('/rooms', rooms);
app.use('/chat', chat);
app.use('/user', user);
app.use('/', route_protection);

export default app;