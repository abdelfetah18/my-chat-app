import { RefDocument } from "./DatabaseClient";
import { Message } from "./RoomMembers";
import { User } from "./Users";

export interface Friend {
    _id?: string;
    inviter?: User | RefDocument;
    user?: User | RefDocument;
    state?: "accept" | "request" | "reject";
    _createdAt?: string;
}

export default class Friends {
    client: DatabaseClient;


    getFriendRequests(user_id: string): Promise<Friend[]>;
    getPeopleMayKnow(user_id: string): Promise<User[]>;
    addFriend(user_id: string, friend_id: string): Promise<Friend>;
    acceptFriend(friend_id: string): Promise<Friend>;
    rejectFriend(friend_id: string): Promise<Friend>;
}