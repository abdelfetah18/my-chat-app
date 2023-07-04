import { getData, getRecentChats } from "../../../../database/client";

export default async function handler(req, res) {
    let user_info = req.decoded_jwt;
    let chats = await getRecentChats(user_info.user_id);
    
    res.status(200).json({
        status:'success',
        message:'your chat list!',
        data: chats
    });
}