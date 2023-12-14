import { readFileSync } from "fs";
import DatabaseClient from "../../domain/DatabaseClient";
import Users, { User } from "../../domain/Users";
import { basename } from "path";
import { USER_PROPS } from "../database/props";

export default class UsersRepository implements Users {
    client: DatabaseClient;
    constructor(client: DatabaseClient){
        this.client = client
    }

    async getUser(user_id: string): Promise<User> {
        return await this.client.get<{ user_id: string }, User>(`*[_type=="user" && _id==$user_id][0]${USER_PROPS}`,{ user_id });
    }

    async getByUsername(username: string): Promise<User> {
        return await this.client.get<{ username: string }, User>(`*[_type=="user" && username==$username][0]${USER_PROPS}`,{ username });
    }

    async updateUser(user_id: string,user: User){
        return await this.client.update<User>(user_id, user);
    }

    async uploadProfileImage(user_id: string,file_Path: string) : Promise<Asset> {
        let fileName = basename(file_Path);
        let data = readFileSync(file_Path);
        return await this.client.uploadAsset(data, fileName, user_id, 'profile_image');
    }

    async uploadCoverImage(user_id: string,file_Path: string) : Promise<Asset> {
        let fileName = basename(file_Path);
        let data = readFileSync(file_Path);
        return await this.client.uploadAsset(data, fileName, user_id, 'cover_image');
    }
}