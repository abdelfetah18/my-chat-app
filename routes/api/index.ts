import route_protection from './route_protection';
import sign_in from './sign_in';
import user from './user/index';
import room from './room/index';
import chat from './chat/index';
import { Router } from 'express';

const app = Router();

// NOTE: When adding new routes, add it before '/' route.
app.use('/sign_in', sign_in);
app.use('/user', user);
app.use('/room', room);
app.use('/chat', chat);
app.use('/', route_protection);

export default app;