import { getData } from "../../../../database/client";

export default async function handler(req, res) {
    var user_info = req.decoded_jwt;
    var chats = await getData('*[_type=="chats" && state=="accept" && (user._ref == $user_id || inviter._ref == $user_id)]{_id,"inviter":*[_type=="users" && @._id == ^.inviter._ref][0]{ username,"profile_image":profile_image.asset->url,"cover_image":cover_image.asset->url,bio },"user":*[_type=="users" && @._id == ^.user._ref][0]{ username,"profile_image":profile_image.asset->url,"cover_image":cover_image.asset->url,bio },"message":*[_type=="messages" && @.chat._ref == ^._id] | order(@._createdAt desc)[0] } | order(@.message._createdAt desc)',{ user_id:user_info.user_id });
    res.status(200).json({
        status:'success',
        message:'your chat list!',
        data:chats
    });
}