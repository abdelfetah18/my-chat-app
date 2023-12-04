import { updateUser } from "../../../../database/client";


export default async function handler(req, res) {
    let { user_id, username, bio } = req.body;

    let user = await updateUser(user_id, { username, bio });
    res.status(200).json({ status:'success', message:'user info updated successfuly!', data: user });
}