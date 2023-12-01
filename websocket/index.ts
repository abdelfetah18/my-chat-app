import jwt from 'jsonwebtoken';
import fs from 'fs';
import Chat from './chat';

const basePath = process.env.INIT_CWD;
let PRIVATE_KEY  = fs.readFileSync(basePath+'/secret/private.key', 'utf8');

import ws_server from 'ws';
import WebSocketClient from '../libs/WebSocketClient';
import { Client } from '../domain/Client';
import { IncomingMessage } from 'http';
const { createMessage } = require('../database/client');

function createWebScoketServer(){
    if(process.env.NODE_ENV == "production")
        return new ws_server.Server({ noServer: true },() => console.log('Websocket server alive!'))
    
    return new ws_server.Server({ port: 4000 },() => console.log('Websocket server alive on port:', 4000));
}

let ws = createWebScoketServer();
let ONLINE_USERS = new Map();
let ONLINE_CHATS = new Map();

ws.on('connection', (socket : WebSocketClient, request : IncomingMessage) => {
    let url = new URL("ws://"+request.headers.host+request.url);
    let token = decodeURI(url.searchParams.get('access_token'));
  
    let client : Client = { socket, url, user: null };

    jwt.verify(token, PRIVATE_KEY,{ algorithms:['RS256'] },(error, data) => {
        if(error){
            // console.log('JWT verify error:', error);
            socket.close();
            return;
        }
        
        client.user = data;
        let chat_id = url.searchParams.get('chat_id');
        let chat = ONLINE_CHATS.get(chat_id);
        if(chat == undefined)
            ONLINE_CHATS.set(chat_id, new Chat(chat_id));
        chat = ONLINE_CHATS.get(chat_id);
    });

    socket.on('close',(code, reason) => {
        let chat = ONLINE_CHATS.get(client.url.searchParams.get('chat_id'));
        chat.close_connection(socket);
    });

    socket.on('message',(data,isBinary) => {
        let { eventName,payload } = JSON.parse(data.toString());
        socket.emit(eventName, payload);
    });

    socket.on('msg',async (payload) => {
        let { chat_id, message_content, message_type } = payload;
        let message_doc = { chat: { _type: "reference", _ref: chat_id }, message_content, message_type, user: { _type: "reference", _ref: client.user.user_id }};
        try {
            let message = await createMessage(message_doc);
            let chat = ONLINE_CHATS.get(chat_id);
            chat.broadcast(socket, message);
        }catch(err){
            console.log(err);
        }
        
    });

    // New user.
    let chat_id : string = url.searchParams.get('chat_id');
    let chat : Chat = ONLINE_CHATS.get(chat_id);
    chat.new_connection(client);
});
    
export default ws;