import { UserSession } from '../../../../domain/UsersSessions';
import { chatMembersRepository, chatsRepository, roomMembersRepository, roomsRepository } from '../../../../repository';

export default async function handler(req, res) {
    let userSession: UserSession = req.userSession;
    let { room } = req.body;

    let roomDoc = await roomsRepository.createRoom(room, userSession.user_id);
    let chat = await chatsRepository.createChat();

    room = await roomsRepository.updateRoom(roomDoc._id, { chat: { _type: "reference", _ref: chat._id }, name: roomDoc.name, bio: roomDoc.bio, is_public: roomDoc.is_public });
    await roomMembersRepository.addMember(roomDoc._id, userSession.user_id, "admin");
    await chatMembersRepository.addChatMember(chat._id, userSession.user_id);

    res.status(200).json({ status: 'success', message: 'room created successfuly!', data: room });
}