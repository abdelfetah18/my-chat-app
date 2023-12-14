import { Message } from "./RoomMembers";

export interface Chat {
    _id?: string;
    theme: string;
    target?: Room | User;
    last_message?: Message;
    messages?: Message[];
    _createdAt?: string;
    bio?: string;
}

export default class Chats {
    client : DatabaseClient;
    
    createChat() : Promise<Chat>;
    deleteChat(chat_id: string) : Promise<void>;
    getRecentChats(user_id: string) : Promise<Chat[]>;
    getChatsByName(name: string,user_id: string) : Promise<Chat[]>;
    getById(chat_id: string,offset: number,user_id: string) : Promise<Chat>;
    deleteMessages(chat_id: string) : Promise<void>;
    // getChat(user_id: string,chat_id: string) : Promise<Chat>;
}