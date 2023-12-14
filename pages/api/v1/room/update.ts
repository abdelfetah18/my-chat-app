import { Room } from "../../../../domain/Rooms";
import { roomsRepository } from "../../../../repository";


export default async function handler(req, res) {
    let _room : Room = req.body;

    let room = await roomsRepository.updateRoom(_room._id, { name: _room.name, bio: _room.bio, is_public: _room.is_public });

    res.status(200).json({ status:'success', message:'user info updated successfuly!', data: room });
}