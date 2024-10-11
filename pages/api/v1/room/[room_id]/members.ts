import { roomMembersRepository } from "../../../../../repository";

export default async function handler(req, res) {
    let { room_id } = req.query;

    let roomMembers = await roomMembersRepository.getMembersByRoomId(room_id);
    if (!roomMembers) {
        res.status(200).json({ status: 'error', message: 'Room does not exist' });
    }
    
    res.status(200).json({
        status:'success',
        data: roomMembers,
    });
}