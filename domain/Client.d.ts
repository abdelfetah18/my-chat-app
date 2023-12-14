import { WebSocketServer } from "./WebSocketServer";

interface Client {
    socket : WebSocketServer;
    user : any;
    url : URL;
}