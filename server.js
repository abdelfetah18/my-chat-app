require('dotenv').config();
const express = require('express');
const next = require('next');
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

let cookieParser = require('cookie-parser');
let routes = require('./routes/index');
let ws = require("./websocket/index");

app.prepare().then(() => {
    const server = express();

    server.use(cookieParser());
    server.use('/', routes);    

    server.post('*/*', (req, res) => handle(req, res));
    server.get('*/*', (req, res) => handle(req, res));

    if(dev){
        server.listen(port, (err) => {
            if (err) throw err;
            console.log(`> Ready on http://127.0.0.1:${port}`);
        });
    }else{
        server.listen(port, (err) => {
            if (err) throw err;
            console.log(`> Ready on http://127.0.0.1:${port}`);
        }).on("upgrade",( request, socket, head) => {
            ws.handleUpgrade( request, socket, head, socket => {
                ws.emit("connection", socket, request);
            });
        });
    }

}).catch((err) => console.log('app express error:',err));
