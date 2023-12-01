import { addChatMember, addMember, createChat, createRoom, updateRoom } from '../../../../database/client';

export default async function handler(req, res) {
    let user_info = req.userSession;
    let { room_name, room_bio } = req.body;
    
    let room_doc = { name: room_name, bio: room_bio, is_public: true, admin: { _type: "reference", _ref: user_info.user_id } };
    let room = await createRoom(room_doc);
    if(room == null){
        res.status(200).json({ status:'fail', message:'name already used!' });
        return;
    }
    
    let chat = await createChat();
    let updated_room = await updateRoom(room._id,{ chat: { _type: "reference", _ref: chat._id } });
    let member = await addMember(room._id, user_info.user_id);
    let chat_member = await addChatMember(chat._id, user_info.user_id);
    res.status(200).json({ status:'success', message:'room created successfuly!', data: { room: updated_room, member, chat_member }});
}