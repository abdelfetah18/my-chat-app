import { Chat } from "./Chats";
import DatabaseClient, { RefDocument } from "./DatabaseClient";
import { Room } from "./Rooms";
import { User } from "./Users";

type MessageType = "text" | "image";
interface Message {
    _id?: string;
    chat: Chat | RefDocument;
    user: User | RefDocument;
    message_content: string;
    message_type: MessageType;
}

export default class Messages {
    client: DatabaseClient;

    createMessage(message: Message) : Promise<Message>;
    uploadImage(message_id: string,file_Path: string) : Promise<Asset>;
    getById(message_id: string) : Promise<Message>;
}