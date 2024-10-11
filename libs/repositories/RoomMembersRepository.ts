import DatabaseClient from "../../domain/DatabaseClient";
import RoomMembers, { RoomMember, RoomMemberRole } from "../../domain/RoomMembers";
import { ROOM_MEMBER_PROPS, } from "../database/props";

export default class RoomMembersRepository implements RoomMembers {
    client: DatabaseClient;
    constructor(client: DatabaseClient) {
        this.client = client
    }

    async addMember(room_id: string, user_id: string, role: RoomMemberRole): Promise<RoomMember> {
        return await this.client.add<RoomMember>("room_member", { room: { _type: "reference", _ref: room_id }, user: { _type: "reference", _ref: user_id }, role });
    }

    async removeMember(room_id: string, user_id: string): Promise<void> {
        return await this.client.deleteByQuery<{ room_id: string, user_id: string }>("*[_type=='room_member' && user._ref==$user_id && room._ref==$room_id]", { room_id, user_id });

    }

    async deleteRoomMembers(room_id: string): Promise<void> {
        return await this.client.deleteByQuery<{ room_id: string }>("*[_type=='room_member' && room._ref==$room_id]", { room_id });
    }

    async getMembersByRoomId(room_id: string): Promise<RoomMember[]> {
        return await this.client.get<{ room_id: string }, RoomMember[]>(`*[_type=='room_member' && room._ref==$room_id]${ROOM_MEMBER_PROPS}`, { room_id });
    }
}