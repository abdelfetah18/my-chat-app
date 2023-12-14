import DatabaseClient, { RefDocument } from "./DatabaseClient";
import { Room } from "./Rooms";
import { User } from "./Users";

interface RoomMember {
    _id?: string;
    room: Room | RefDocument;
    user: User | RefDocument;
}

export default class RoomMembers {
    client: DatabaseClient;

    addMember(room_id: string,user_id: string) : Promise<RoomMember>;
    removeMember(room_id: string,user_id: string) : Promise<void>;
    deleteRoomMembers(room_id: string) : Promise<void>;
}