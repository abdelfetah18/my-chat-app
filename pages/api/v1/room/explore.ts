import { roomsRepository } from "../../../../repository";

export default async function handler(req, res) {
    let userSession = req.userSession;
    let rooms = await roomsRepository.getExploreRooms(userSession.user_id);
    
    res.status(200).json({ status: 'success', data: rooms });
}