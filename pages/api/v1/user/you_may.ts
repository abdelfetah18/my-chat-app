import { UserSession } from "../../../../domain/UsersSessions";
import { friendsRepository, roomsRepository } from "../../../../repository";

export default async function handler(req, res) {
    let userSession: UserSession = req.userSession;

    let people_may_know = await friendsRepository.getPeopleMayKnow(userSession.user_id);
    let friends_requests = await friendsRepository.getFriendRequests(userSession.user_id);
    let rooms_you_may_like = await roomsRepository.getExploreRooms(userSession.user_id);

    res.status(200).json({
        status: 'success',
        message: 'your chat list!',
        data: { people_may_know, friends_requests, rooms_you_may_like }
    });
}