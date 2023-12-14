import WS from 'ws';
import { Payload } from "../../domain/WebSocketServer";

export default class WebSocketClient extends WS implements WebSocketClient {
    broadcast(eventName: string, payload: Payload): void {
        this.send(JSON.stringify({ eventName, payload }));
    }
}