import { chatsRepository } from "../../../../repository";

export default async function handler(req, res) {
    let userSession = req.userSession;
    let { chat_id, offset } = req.query;

    let chat = await chatsRepository.getById(chat_id, parseInt(offset), userSession.user_id);
    if (!chat) {
        res.status(200).json({ status: 'error', message: 'Chat does not exist' });
    }

    res.status(200).json({
        status: 'success',
        message: 'your chat list!',
        data: chat
    });
}