import { getData, getExplorePeople, getExploreRooms, getFriendRequests } from "../../../../database/client";

export default async function handler(req, res) {
    let user_info = req.decoded_jwt;
    let people_may_know = await getExplorePeople(user_info.user_id);
    let friends_requests = await getFriendRequests(user_info.user_id);
    let rooms_you_may_like = await getExploreRooms(user_info.user_id);
    
    res.status(200).json({
        status:'success',
        message:'your chat list!',
        data:{ people_may_know,friends_requests,rooms_you_may_like }
    });
}