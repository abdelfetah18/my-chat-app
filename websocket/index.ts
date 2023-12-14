import { WSServer } from './WSServer';

const isDev = process.env.NODE_ENV !== 'production';

function createWebScoketServer(): WSServer {
    if (!isDev)
        return new WSServer({ noServer: true }, () => console.log('Websocket server alive!'))

    return new WSServer({ port: 4000 }, () => console.log('Websocket server alive on port:', 4000));
}

let ws: WSServer = createWebScoketServer();

ws.on('connection', ws.handleConnection);

export default ws;