import DatabaseClient, { RefDocument } from "./DatabaseClient";
import { Room } from "./Rooms";
import { User } from "./Users";

type RoomMemberRole = "admin" | "member";
interface RoomMember {
    _id?: string;
    room: Room | RefDocument;
    user: User | RefDocument;
    role: RoomMemberRole;
}

export default class RoomMembers {
    client: DatabaseClient;

    addMember(room_id: string, user_id: string, role: RoomMemberRole): Promise<RoomMember>;
    removeMember(room_id: string, user_id: string): Promise<void>;
    deleteRoomMembers(room_id: string): Promise<void>;
    getMembersByRoomId(room_id: string): Promise<RoomMember[]>;
}