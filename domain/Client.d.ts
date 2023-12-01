import { WebSocketClient } from "./WebSocketClient";

interface Client {
    socket : WebSocketClient;
    user : any;
    url : URL;
}