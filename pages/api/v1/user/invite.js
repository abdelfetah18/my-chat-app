import { addFriend } from "../../../../database/client";

export default async function handler(req, res) {
    let user_id = req.decoded_jwt.user_id;
    let { friend_id } = req.body;
    let data = await addFriend(user_id, friend_id);
    res.status(200).json({ status:'success', message:'Invite sent', data });
}