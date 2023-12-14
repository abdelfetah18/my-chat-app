import { basename } from "path";
import DatabaseClient from "../../domain/DatabaseClient";
import Messages, { Message } from "../../domain/Messages";
import { readFileSync } from "fs";
import { MESSAGE_PROPS } from "../database/props";

export default class MessagesRepository implements Messages {
    client : DatabaseClient;
    constructor(client : DatabaseClient){
        this.client = client;
    }

    async createMessage(message: Message): Promise<Message> {
        return await this.client.add<Message>("message", message);
    }

    async uploadImage(message_id: string,file_Path: string) : Promise<Asset> {
        let fileName = basename(file_Path);
        let data = readFileSync(file_Path);
        return await this.client.uploadAsset(data, fileName, message_id, 'message_image');
    }

    async getById(message_id: string): Promise<Message> {
        return await this.client.get<{ message_id: string },Message>(`*[_type=='message' && _id==$message_id]${MESSAGE_PROPS}[0]`, { message_id });
    }
}