import { getChatsByName } from "../../../database/client";

export default async function handler(req, res) {
    let user_info = req.decoded_jwt;
    let { username } = req.query;
    let chats = await getChatsByName(username, user_info.user_id);
    chats = chats.filter(c => (c.name || c.username));
    res.status(200).json({
        status:'success',
        message:'your chat list!',
        data: chats
    });
}