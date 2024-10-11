import { roomsRepository } from "../../../../../repository";

export default async function handler(req, res) {
    let { room_id } = req.query;

    let room = await roomsRepository.getRoom(room_id);
    if (!room) {
        res.status(200).json({ status: 'error', message: 'Room does not exist' });
    }
    
    res.status(200).json({
        status:'success',
        data: room,
    });
}