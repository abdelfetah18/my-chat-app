import { chatsRepository } from "../../../../repository";

export default async function handler(req, res) {
    let user_info = req.userSession;
    let { chat_id } = req.body;
    
    let chats = await chatsRepository.getRecentChats(user_info.user_id);
    chats = chats.filter(c => c.target);
    
    if(chat_id){
        chats = chats.sort(c => c._id == chat_id ? -1 : 1);
    }

    res.status(200).json({
        status:'success',
        data: chats
    });
}