import WebSocketClient from "../libs/utils/WebSocketClient";
import WebSocketChat from "./WSChat";

type WSPTarget = "chat";
type WSPAction = "sendMessage";

export interface WSPayload {
    target: WSPTarget;
    action: WSPAction;
    data: any
};

export class WSClient {
    private socket: WebSocketClient;
    chat: WebSocketChat;
    user_id: string;

    constructor(socket: WebSocketClient, chat: WebSocketChat, user_id: string) {
        this.socket = socket;
        this.chat = chat;
        this.user_id = user_id;
    }

    sendMessage(data: WSPayload): void {
        this.socket.send(JSON.stringify(data));
    }
}