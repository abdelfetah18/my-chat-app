import { chatsRepository } from "../../../../repository";

export default async function handler(req, res) {
    let user_info = req.userSession;
    let { q } = req.query;

    let chats = await chatsRepository.getChatsByName(q, user_info.user_id);
    chats = chats.filter(c => c.target);

    res.status(200).json({
        status:'success',
        message:'your chat list!',
        data: chats
    });
}