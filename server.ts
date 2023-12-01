import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import next from 'next';

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

import cookieParser from 'cookie-parser';
import routes from './routes/index';
import ws from './websocket/index';

app.prepare().then(() => {
    const server = express();

    server.use(cookieParser());
    server.use('/', routes);    

    server.post('*/*', (req, res) => handle(req, res));
    server.get('*/*', (req, res) => handle(req, res));

    if(dev){
        server.listen(port, () => {
            console.log(`> Ready on http://127.0.0.1:${port}`);
        });
    }else{
        server.listen(port, () => {
            console.log(`> Ready on http://127.0.0.1:${port}`);
        }).on("upgrade",( request, socket, head) => {
            ws.handleUpgrade( request, socket, head, socket => {
                ws.emit("connection", socket, request);
            });
        });
    }

}).catch((err) => console.log('app express error:',err));
