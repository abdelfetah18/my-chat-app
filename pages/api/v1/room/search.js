import { getData } from "../../../../database/client";

export default async function handler(req, res) {
    let user_info = req.decoded_jwt;
    let { name } = req.query;
    let rooms = await getData('*[_type=="room_members" && room->name match $name && state=="accept" && member._ref==$user_id]{"room":*[_type=="rooms" && @._id == ^.room._ref][0]{_id,name,bio,"profile_image":profile_image.asset->url,"cover_image":cover_image.asset->url},"message":*[_type=="room_messages" && @.room._ref==^.room._ref] | order(@._createdAt desc)[0],} | order(@.message._createdAt desc)',{ user_id:user_info.user_id,name:name+"*" });
    res.status(200).json({
        status:'success',
        message:'your chat list!',
        data:rooms
    });
}