import { acceptFriend, addChatMember, createChat } from "../../../../database/client";

export default async function handler(req, res) {
    let user_info = req.userSession;
    let { friend_id } = req.body;
    let friend_request = await acceptFriend(friend_id);
    let chat = await createChat();
    let chat_member_1 = await addChatMember(chat._id, friend_id);
    let chat_member_2 = await addChatMember(chat._id, user_info.user_id);
    res.status(200).json({ status:'success',message:'user accepted successfuly!', data: { friend_request, chat, chat_member_1, chat_member_2 } });
}