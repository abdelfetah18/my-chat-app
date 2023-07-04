import { addChatMember, addData, addMember, deleteChat, deleteChatMembers, deleteChatMessages, deleteRoom, deleteRoomMembers, getData, getRoom } from "../../../../database/client";

// FIXME: Only admin can delete a room.
export default async function handler(req, res) {
    let user_info = req.decoded_jwt;
    let { room_id } = req.body;
    
    let room = await getRoom(room_id);
    if(room == null){
        res.status(200).json({ status:'error', message:'Room not found' });
        return;
    }

    // Delete room members
    await deleteRoomMembers(room_id);

    // Delete chat messages
    await deleteChatMessages(room.chat._id);
    
    // Delete chat members
    await deleteChatMembers(room.chat._id);
    
    // Delete chat
    await deleteChat(room.chat._id);
    
    // Delete room
    await deleteRoom(room_id);

    res.status(200).json({ status:'success', message:'Room deleted successfuly' });
}