import DatabaseClient from "../../domain/DatabaseClient";
import Friends, { Friend } from "../../domain/Friends";
import { User } from "../../domain/Users";
import { FRIEND_PROPS, USER_PROPS } from "../database/props";

export default class FriendsRepository implements Friends {
    client : DatabaseClient;
    constructor(client : DatabaseClient){
        this.client = client;
    }

    async acceptFriend(friend_id: string): Promise<Friend> {
        return await this.client.update<Friend>(friend_id,{ state: 'accept' });
    }

    async addFriend(user_id: string, friend_id: string): Promise<Friend> {
        return await this.client.add<Friend>("friend", { inviter: { _type: "reference", _ref: user_id }, user: { _type: "reference", _ref: friend_id }, state: "request" });
    }

    async getFriendRequests(user_id: string): Promise<Friend[]> {
        return await this.client.get<{ user_id: string }, Friend[]>(`*[_type=="friend" && user._ref == $user_id && state=="request"]${FRIEND_PROPS}`, { user_id });
    }

    async rejectFriend(friend_id: string): Promise<Friend> {
        return await this.client.update<Friend>(friend_id,{ state: 'reject' });
    }

    async getPeopleMayKnow(user_id: string): Promise<User[]> {
        return await this.client.get<{ user_id: string }, User[]>(`*[_type=="user" && _id != $user_id && !(_id in [...*[_type=="friend" && (user._ref == $user_id)].inviter._ref,...*[_type=="friend" && (inviter._ref == $user_id)].user._ref])]${USER_PROPS}`, { user_id });
    }
}