import { Chat } from "./Chats";
import DatabaseClient, { RefDocument } from "./DatabaseClient";
import { User } from "./Users";

interface ChatMember {
    _id?: string;
    chat: Chat | RefDocument;
    user: User | RefDocument;
}

export default class ChatMembers {
    client: DatabaseClient;

    async addChatMember(chat_id: string,user_id: string) : Promise<ChatMember>;
    async deleteMembers(chat_id: string) : Promise<void>;
    async removeChatMember(chat_id: string,user_id: string) : Promise<void>;
}