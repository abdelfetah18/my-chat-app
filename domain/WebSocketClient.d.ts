import WS from 'ws';

export interface Payload {
    chat_id : string;
    message_content : string;
    message_type : string;
}

export class WebSocketClient extends WS {
    broadcast(eventName : string, payload : Payload) : void;
}