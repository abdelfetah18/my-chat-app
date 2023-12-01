import { addChatMember, addData, addMember, getData, getRoom, removeChatMember, removeMember } from "../../../../database/client";

export default async function handler(req, res) {
    let user_info = req.userSession;
    let { room_id } = req.body;
    
    let room = await getRoom(room_id)
    if(room == null){
        res.status(200).json({ status:'error', message:'Room not found' });
        return;
    }
    
    let chat_member = await removeChatMember(room.chat._id, user_info.user_id);
    let member = await removeMember(room_id, user_info.user_id);

    res.status(200).json({ status:'success', message:'Leave success', data: { room, member, chat_member }});
}