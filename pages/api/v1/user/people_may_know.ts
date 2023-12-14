import { friendsRepository } from "../../../../repository";

export default async function handler(req, res) {
    let userSession = req.userSession;

    let peopleMayKnow = await friendsRepository.getPeopleMayKnow(userSession.user_id);

    res.status(200).json({
        status: 'success',
        data: peopleMayKnow
    });
}