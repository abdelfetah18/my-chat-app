import { UserSession } from "../../../../domain/UsersSessions";
import { chatMembersRepository, chatsRepository, friendsRepository } from "../../../../repository";

export default async function handler(req, res) {
    let userSession : UserSession = req.userSession;
    let { friend_id } = req.body;
    
    let friend_request = await friendsRepository.acceptFriend(friend_id);
    let chat = await chatsRepository.createChat();
    let chat_member_1 = await chatMembersRepository.addChatMember(chat._id, friend_id);
    let chat_member_2 = await chatMembersRepository.addChatMember(chat._id, userSession.user_id);

    res.status(200).json({ status:'success',message:'user accepted successfuly!', data: { friend_request, chat, chat_member_1, chat_member_2 } });
}