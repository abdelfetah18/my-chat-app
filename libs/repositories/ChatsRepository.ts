import Chats, { Chat } from "../../domain/Chats";
import DatabaseClient from "../../domain/DatabaseClient";
import { MESSAGE_PROPS, ROOM_PROPS, USER_PROPS } from "../database/props";

export default class ChatsRepository implements Chats {
    client : DatabaseClient;
    constructor(client : DatabaseClient){
        this.client = client;
    }

    async createChat(): Promise<Chat> {
        return await this.client.add<Chat>('chat', { theme: 'light' });
    }

    async deleteChat(chat_id: string): Promise<void> {
        await this.client.delete(chat_id);
    }

    async getRecentChats(user_id: string): Promise<Chat[]> {
        let query = `*[_type=="chat" && _id in *[_type=="chat_member" && user._ref==$user_id].chat._ref && count(*[_type=="message" && chat._ref==^._id]) > 0]{
            _id,
            "last_message": *[_type=="message" && chat._ref==^._id] | order(_createdAt desc)[0]${MESSAGE_PROPS},
            "target": select(
                count(*[_type=="room" && chat._ref==^._id]) > 0 => *[_type=="room" && chat._ref==^._id][0]${ROOM_PROPS},
                count(*[_type=="chat_member" && chat._ref==^._id]) == 2 => *[_type=="chat_member" && chat._ref==^._id && user._ref!=$user_id][0].user->${USER_PROPS}
            )
        }`;

        return await this.client.get<{ user_id: string }, Chat[]>(query,{ user_id });
    }

    async getChatsByName(name: string, user_id: string): Promise<Chat[]> {
        let query = `*[_type=="chat" && _id in *[_type=="chat_member" && user._ref==$user_id].chat._ref]{
            _id,
            "last_message": *[_type=="message" && chat._ref==^._id] | order(_createdAt desc)[0]${MESSAGE_PROPS},
            "target": select(
            count(*[_type=="room" && chat._ref==^._id]) > 0 => *[_type=="room" && chat._ref==^._id && name match '*'+$name+'*'][0]${ROOM_PROPS},
            count(*[_type=="chat_member" && chat._ref==^._id]) == 2 => *[_type=="chat_member" && chat._ref==^._id && user._ref!=$user_id && user->username match '*'+$name+'*'][0].user->${USER_PROPS}
            )
        }`;

        return await this.client.get<{ user_id: string; name: string },Chat[]>(query,{ user_id, name });
    }

    async getById(chat_id: string, offset: number,user_id: string): Promise<Chat> {
        let query = `*[_type=="chat" && _id == $chat_id]{
            _id,
            "messages": *[_type=="message" && chat._ref==^._id] | order(_createdAt asc)[$offset...($offset+20)]${MESSAGE_PROPS},
            "target": select(
                count(*[_type=="room" && chat._ref==^._id]) > 0 => *[_type=="room" && chat._ref==^._id][0]${ROOM_PROPS},
                count(*[_type=="chat_member" && chat._ref==^._id]) == 2 => *[_type=="chat_member" && chat._ref==^._id && user._ref!=$user_id][0].user->${USER_PROPS}
            )
        }[0]`;

        return await this.client.get<{ user_id: string; chat_id: string; offset: number }, Chat>(query,{ user_id, chat_id, offset });
    }

    async deleteMessages(chat_id: string): Promise<void> {
        await this.client.deleteByQuery<{ chat_id: string }>("*[_type=='message' && chat._ref==$chat_id]", { chat_id });
    }
}