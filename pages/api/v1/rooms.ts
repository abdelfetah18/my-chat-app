import { roomsRepository } from "../../../repository";

export default async function handler(req, res) {
    let userSession = req.userSession;
    let { room_id } = req.body;
    
    let rooms = await roomsRepository.getRooms(userSession.user_id);
    
    if(room_id){
        rooms = rooms.sort(c => c._id == room_id ? -1 : 1);
    }

    res.status(200).json({
        status:'success',
        data: rooms
    });
}