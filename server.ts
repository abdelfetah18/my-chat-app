import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import next from 'next';

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';

// [ IMPORTANT ]==================================================================
//      This is a work around to disable next js upgradeHandler for websocket.
//      On Real Production environment this app will use two diffrent servers
//      But since i am just using a free hosting service i need this work around.

import { Server } from 'http';
let stubServer: Server = null;

if (!dev) {
    stubServer = new Server();
    stubServer.on = (eventName: string, callback: (...args: any[]) => void): Server => {
        console.log(`# Next js is trying to register: ${eventName}`);
        callback;
        return stubServer;
    }
}

// [ END_IMPORTANT ]==============================================================

const app = next({ dev, httpServer: stubServer });
const handle = app.getRequestHandler();

import cookieParser from 'cookie-parser';
import routes from './routes/index';
import ws from './websocket/index';

console.log("#", dev ? "Running on devlopement" : "Running on production");

app.prepare().then(() => {
    const server = express();

    server.use(cookieParser());
    server.use('/', routes);

    server.post('*/*', (req, res) => handle(req, res));
    server.get('*/*', (req, res) => handle(req, res));

    if (dev) {
        server.listen(port, () => {
            console.log(`> Ready on http://127.0.0.1:${port}`);
        });
    } else {
        server.listen(port, () => {
            console.log(`> Ready on http://127.0.0.1:${port}`);
        }).on("upgrade", (request, socket, head) => {
            ws.handleUpgrade(request, socket, head, (_socket, _request) => {
                ws.emit("connection", _socket, _request);
            });
        });
    }
}).catch((err) => console.log('app express error:', err));
