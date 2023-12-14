import { Chat } from "../../../../domain/Chats";
import { chatMembersRepository, roomMembersRepository, roomsRepository } from "../../../../repository";

export default async function handler(req, res) {
    let userSession = req.userSession;
    let { room_id } = req.body;
    
    let room = await roomsRepository.getRoom(room_id)
    if(room == null){
        res.status(200).json({ status:'error', message:'Room not found' });
        return;
    }

    let chat_member = await chatMembersRepository.addChatMember((room.chat as Chat)._id, userSession.user_id);
    let member = await roomMembersRepository.addMember(room_id, userSession.user_id);

    res.status(200).json({ status:'success', message:'Request sent successfuly', data: { room, member, chat_member }});
}