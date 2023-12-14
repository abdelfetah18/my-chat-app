import Rooms, { Room } from "../../domain/Rooms";
import DatabaseClient from "../../domain/DatabaseClient";
import { basename } from "path";
import { readFileSync } from "fs";
import { ROOM_PROPS } from "../database/props";

export default class RoomsRepository implements Rooms {
    client : DatabaseClient;
    constructor(client : DatabaseClient){
        this.client = client;
    }

    async getExploreRooms(user_id: string) : Promise<Room[]> {
        // Rooms that user is not in yet
        try {
            return await this.client.get<{ user_id: string }, Room[]>(`*[_type=="room" && !(_id in *[_type=="room_member" && user._ref == $user_id].room._ref)]${ROOM_PROPS}`,{ user_id });
        }catch(err){
            return [];
        }
    }

    async getRoom(room_id: string): Promise<Room> {
        try {
            return await this.client.get<{ room_id: string }, Room>(`*[_type=="room" && (_id==$room_id  || name == $room_id)][0]${ROOM_PROPS}`,{ room_id });
        }catch(err){
            console.error("DATABASE Error:", err);
            return null;
        }
    }

    async getRooms(user_id: string): Promise<Room[]> {
        try {
            return await this.client.get<{ user_id: string }, Room[]>(`*[_type=="room" && _id in *[_type=="room_member" && user._ref==$user_id].room._ref]${ROOM_PROPS}`,{ user_id });
        }catch(err){
            console.error("DATABASE Error:", err);
            return [];
        }
    }

    async createRoom(room: Room,user_id: string): Promise<Room> {
        return await this.client.add<Room>('room', { name: room.name, bio: room.bio, is_public: room.is_public, admin: { _type: "reference", _ref: user_id }});
    }

    async updateRoom(room_id: string, room: Room) : Promise<Room> {
        return await this.client.update<Room>(room_id, room);
    }

    async deleteRoom(room_id: string) : Promise<void> {
        await this.client.delete(room_id);
    }

    async uploadProfileImage(room_id: string,file_Path: string) : Promise<Asset> {
        let fileName = basename(file_Path);
        let data = readFileSync(file_Path);
        return await this.client.uploadAsset(data, fileName, room_id, 'profile_image');
    }

    async uploadCoverImage(room_id: string,file_Path: string) : Promise<Asset> {
        let fileName = basename(file_Path);
        let data = readFileSync(file_Path);
        return await this.client.uploadAsset(data, fileName, room_id, 'cover_image');
    }
}