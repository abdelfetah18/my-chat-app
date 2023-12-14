import DatabaseClient from "../../domain/DatabaseClient";
import RoomMembers, { RoomMember } from "../../domain/RoomMembers";

export default class RoomMembersRepository implements RoomMembers {
    client: DatabaseClient;
    constructor(client: DatabaseClient){
        this.client = client
    }

    async addMember(room_id: string, user_id: string): Promise<RoomMember> {
        return await this.client.add<RoomMember>("room_member",{ room: { _type: "reference", _ref: room_id }, user: { _type: "reference", _ref: user_id }});
    }

    async removeMember(room_id: string, user_id: string): Promise<void> {
        return await this.client.deleteByQuery<{ room_id: string, user_id: string }>("*[_type=='room_member' && user._ref==$user_id && room._ref==$room_id]", { room_id, user_id });
        
    }

    async deleteRoomMembers(room_id: string): Promise<void> {
        return await this.client.deleteByQuery<{ room_id: string }>("*[_type=='room_member' && room._ref==$room_id]", { room_id });
    }
}