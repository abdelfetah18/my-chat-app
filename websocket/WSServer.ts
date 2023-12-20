import { IncomingMessage } from "http";
import { Server } from "ws";
import WebSocketClient from "../libs/utils/WebSocketClient";
import jwt from 'jsonwebtoken';
import { UserSession } from "../domain/UsersSessions";
import WSChat from "./WSChat";
import { WSClient, WSPayload } from "./WSClient";
import { Message } from "../domain/Messages";
import { messagesRepository } from "../repository";
import { Chat } from "../domain/Chats";

let JWT_KEY = process.env.JWT_KEY;

type ChatId = string;

export class WSServer extends Server {
    online_chats: Map<ChatId, WSChat> = new Map();

    handleConnection(socket: WebSocketClient, request: IncomingMessage): void {
        let url = new URL("ws://" + request.headers.host + request.url);

        let access_token = decodeURI(url.searchParams.get('access_token'));

        jwt.verify(access_token, JWT_KEY, { algorithms: ['HS256'] }, (error, userSession: UserSession) => {
            if (error) {
                console.log('JWT verify error:', error);
                socket.close();
                return;
            }

            let chat_id = url.searchParams.get('chat_id');
            let chat = this.online_chats.get(chat_id);
            if (chat == undefined)
                this.online_chats.set(chat_id, new WSChat(chat_id));

            chat = this.online_chats.get(chat_id);
            let client: WSClient = new WSClient(socket, chat, userSession.user_id);
            chat.new_connection(client);

            socket.on('message', async (data: Buffer): Promise<void> => {
                let parsedData: WSPayload = JSON.parse(data.toString());
                console.log({ message: parsedData.data });
                if (parsedData.target == "chat") {
                    if (parsedData.action == "sendMessage") {
                        let { chat: _chat, message_content, message_type } = parsedData.data as Message;
                        if(message_type == "image"){
                            chat.broadcast(client, parsedData);
                            return;
                        }

                        let message_doc: Message = { chat: { _type: "reference", _ref: (_chat as Chat)._id }, message_content, message_type, user: { _type: "reference", _ref: userSession.user_id } };
                        let message: Message = await messagesRepository.createMessage(message_doc);
                        let data = { chat: { _id: (message.chat as Chat)._id }, message_content: message.message_content, message_type: message.message_type };
                        chat.broadcast(client, { action: 'sendMessage', target: 'chat', data });
                    }
                }
            });

            socket.on('close', () => { chat.close_connection(client); });
        });
    }
}