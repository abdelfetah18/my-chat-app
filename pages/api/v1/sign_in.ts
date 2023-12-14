import { usersSessionsRepository } from "../../../repository";

export default async function handler(req, res) {
    let { username, password } = req.body;
    let userSession = await usersSessionsRepository.signIn({ username, password });
    
    if(!userSession.access_token){
        res.status(200).json({ status:"error", message:"Bad credentials" });
    }

    res.status(200).json({ status:"success", message:"Sign in success", data: userSession });
}