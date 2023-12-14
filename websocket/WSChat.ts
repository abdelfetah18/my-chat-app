import { WSClient, WSPayload } from "./WSClient";

export default class WSChat {
    clients : WSClient[];
    chat_id : string;
    constructor(chat_id : string){
        this.chat_id = chat_id;
        this.clients = [];
    }

    new_connection(client : WSClient) : void {
        this.clients.push(client);
        console.log("new connection:", this.clients.length);
    }

    close_connection(client : WSClient) : void {
        this.clients = this.clients.filter(c => c.user_id != client.user_id);
        console.log("close connection:", this.clients.length);
    }

    broadcast(client : WSClient, payload : WSPayload){
        for(let c of this.clients){
            console.log("c.user_id:", c.user_id);
            if(c.user_id != client.user_id)
                c.sendMessage(payload);
        }
    }
}
