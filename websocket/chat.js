class Chat {
    constructor(chat_id){
        this.chat_id = chat_id;
        this.clients = [];
    }

    new_connection(client){
        this.clients.push(client);
    }

    close_connection(client){
        this.clients = this.clients.filter(c => c.user_info.user_id != client.user_info.user_id);
    }

    broadcast(client, payload){
        console.log({
            payload,
            message:"broadcast()",
            clients: this.clients.length
        })
        for(let c of this.clients){
            if(c.user_info.user_id != client.user_info.user_id)
                c.broadcast("msg", payload);
        }
    }
}

module.exports = Chat;