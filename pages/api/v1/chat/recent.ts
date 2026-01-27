import { chatsRepository } from "../../../../repository";

export default async function handler(req, res) {
    let user_info = req.userSession;

    let chats = await chatsRepository.getRecentChats(user_info.user_id);
    chats = chats.filter(c => c.target);

    res.status(200).json({
        status: 'success',
        data: chats
    });
}