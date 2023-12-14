import { usersRepository } from "../../../../repository";


export default async function handler(req,res) {
    let user_info = req.userSession;
    let { username, bio } = req.body;

    let user = await usersRepository.updateUser(user_info.user_id, { username, bio });

    res.status(200).json({ status:'success', message:'user info updated successfuly!', data: user });
}