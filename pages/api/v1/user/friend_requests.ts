import { friendsRepository } from "../../../../repository";

export default async function handler(req, res) {
    let user_info = req.userSession;

    let friendRequests = await friendsRepository.getFriendRequests(user_info.user_id);

    res.status(200).json({
        status: 'success',
        data: friendRequests
    });
}