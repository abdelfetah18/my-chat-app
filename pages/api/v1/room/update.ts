import { updateRoom } from "../../../../database/client";


export default async function handler(req, res) {
    let { room_id, name, bio } = req.body;

    let room = await updateRoom(room_id, { name, bio });
    res.status(200).json({ status:'success', message:'user info updated successfuly!', data: room });
}