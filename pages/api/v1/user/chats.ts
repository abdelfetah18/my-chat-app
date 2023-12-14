import { UserSession } from "../../../../domain/UsersSessions";
import { chatsRepository } from "../../../../repository";

export default async function handler(req, res) {
    let userSession : UserSession = req.userSession;
    let chats = await chatsRepository.getRecentChats(userSession.user_id);
    
    res.status(200).json({
        status:'success',
        data: chats
    });
}