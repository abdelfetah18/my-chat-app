import { SanityClient } from "@sanity/client";
import { Chat } from "./Chats";
import { User } from "./Users";
import DatabaseClient, { RefDocument } from "./DatabaseClient";

export interface Room {
    _id?: string;
    name: string;
    chat?: Chat | RefDocument;
    profile_image?: Asset;
    cover_image?: Asset;
    bio: string;
    is_public: boolean;
    admin?: User | RefDocument;
    _createdAt?: string | Date;
    total_members?: number;
}

export default class Rooms {
    client : DatabaseClient;
    getExploreRooms(user_id : string) : Promise<Room[]>;
    getRoom(room_id : string) : Promise<Room>;
    getRooms(user_id : string) : Promise<Room[]>;
    createRoom(room : Room,user_id: string) : Promise<Room>;
    updateRoom(room_id : string,room : Room) : Promise<Room>;
    deleteRoom(room_id : string) : Promise<void>;
    uploadProfileImage(room_id: string,file_Path: string) : Promise<Asset>;
    uploadCoverImage(room_id: string,file_Path: string) : Promise<Asset>;
}