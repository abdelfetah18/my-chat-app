import { Chat } from "../../../../domain/Chats";
import { User } from "../../../../domain/Users";
import { UserSession } from "../../../../domain/UsersSessions";
import { chatMembersRepository, chatsRepository, roomMembersRepository, roomsRepository } from "../../../../repository";

export default async function handler(req, res) {
    let userSession : UserSession = req.userSession;
    let { room_id } = req.body;
    
    let room = await roomsRepository.getRoom(room_id);
    if(room == null){
        res.status(200).json({ status:'error', message:'Room not found' });
        return;
    }

    if((room.admin as User)._id != userSession.user_id){
        res.status(200).json({ status:'error', message:'You are not the admin' });
        return;
    }

    let chat : Chat = room.chat as Chat;

    // Delete room members
    await roomMembersRepository.deleteRoomMembers(room_id);

    // Delete chat messages
    await chatsRepository.deleteMessages(chat._id);
    
    // Delete chat members
    await chatMembersRepository.deleteMembers(chat._id);
    
    // Delete room
    await roomsRepository.deleteRoom(room_id);
    
    // Delete chat
    await chatsRepository.deleteChat(chat._id);

    res.status(200).json({ status:'success', message:'Room deleted successfuly' });
}