import { usersRepository } from "../../../../repository";

export default async function handler(req, res) {
    let user_info = req.userSession;
    
    let user = await usersRepository.getUser(user_info.user_id);
    
    res.status(200).json({
        status:'success',
        data: user
    });
}