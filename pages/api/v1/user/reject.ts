import { rejectFriend } from "../../../../database/client";

export default async function handler(req, res) {
    let { friend_id } = req.body;
    let data = await rejectFriend(friend_id);
    res.status(200).json({ status:'success',message:'user rejected successfuly!',data });
}