import { Client } from "../domain/Client";
import { Payload } from "../domain/WebSocketClient";

export default class Chat {
    clients : Client[];
    chat_id : string;
    constructor(chat_id : string){
        this.chat_id = chat_id;
        this.clients = [];
    }

    new_connection(client : Client) : void {
        this.clients.push(client);
    }

    close_connection(client : Client) : void {
        this.clients = this.clients.filter(c => c.user.user_id != client.user.user_id);
    }

    broadcast(client : Client, payload : Payload){
        console.log({
            payload,
            message:"broadcast()",
            clients: this.clients.length
        })
        for(let c of this.clients){
            if(c.user.user_id != client.user.user_id)
                c.socket.broadcast("msg", payload);
        }
    }
}
