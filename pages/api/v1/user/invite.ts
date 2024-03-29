import { friendsRepository } from "../../../../repository";

export default async function handler(req, res) {
    let user_id = req.userSession.user_id;
    let { friend_id } = req.body;

    let data = await friendsRepository.addFriend(user_id, friend_id);
    
    res.status(200).json({ status:'success', message:'Invite sent', data });
}