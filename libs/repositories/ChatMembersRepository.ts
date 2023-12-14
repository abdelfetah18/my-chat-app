import ChatMembers, { ChatMember } from "../../domain/ChatMembers";
import DatabaseClient from "../../domain/DatabaseClient";

export default class ChatMembersRepository implements ChatMembers {
    client : DatabaseClient;
    constructor(client : DatabaseClient){
        this.client = client;
    }

    async addChatMember(chat_id: string,user_id: string) : Promise<ChatMember> {
        return await this.client.add<ChatMember>("chat_member",{ chat: { _type: "reference", _ref: chat_id }, user: { _type: "reference", _ref: user_id }});
    }

    async deleteMembers(chat_id: string): Promise<void> {
        await this.client.deleteByQuery<{ chat_id: string }>("*[_type=='chat_member' && chat._ref==$chat_id]",{ chat_id });
    }

    async removeChatMember(chat_id: string, user_id: string): Promise<void> {
        await this.client.deleteByQuery<{ chat_id: string; user_id: string; }>("*[_type=='chat_member' && chat._ref == $chat_id && user._ref == $user_id]",{ chat_id, user_id });
    }
}