import { getData } from "../../../../database/client";

export default async function handler(req, res) {
    var user_info = req.decoded_jwt;
    var people_may_know = await getData('*[_type=="users" && _id != $user_id && !(_id in [...*[_type=="chats" && (user._ref == $user_id)].inviter._ref,...*[_type=="chats" && (inviter._ref == $user_id)].user._ref])]{ _id,username,"profile_image":profile_image.asset->url,"cover_image":cover_image.asset->url,bio}',{ user_id:user_info.user_id });
    var friends_requests = await getData('*[_type=="chats" && state=="invite" && user._ref == $user_id]{ _id,"inviter":*[_type=="users" && _id==^.inviter._ref]{ _id,username,"profile_image":profile_image.asset->url,"cover_image":cover_image.asset->url,bio }[0]}',{ user_id:user_info.user_id });
    var rooms_you_may_like = await getData('*[_type=="rooms" && !(_id in *[_type=="room_members" && member._ref == $user_id].room._ref)]{name,bio,"profile_image": profile_image.asset->url}',{ user_id:user_info.user_id });
   
    res.status(200).json({
        status:'success',
        message:'your chat list!',
        data:{ people_may_know,friends_requests,rooms_you_may_like }
    });
}