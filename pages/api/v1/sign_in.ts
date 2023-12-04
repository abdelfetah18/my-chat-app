import JWT from "jsonwebtoken"
import { getUserWithPassword } from "../../../database/client";
import bcrypt from "bcrypt";
import { privateKEY } from '../../../secret';

export default async function handler(req, res) {
    let { username:_username,password } = req.body;
    let user = await getUserWithPassword(_username);
    if(!user){
        res.status(200).json({ status:'error', message:'User not found!' });
        return;
    }
    
    let { _id:user_id, username, password:encrypted_pwd } = user;
    console.log({
        password, encrypted_pwd
    })
    let is_equal = await bcrypt.compare(password,encrypted_pwd);
    if(is_equal){
        let token = JWT.sign({ user_id,username }, privateKEY, { algorithm:"RS256", expiresIn: 1000*60*60*24 });
        res.status(200).json({ status:"success", message:"SignIn success", token, user_info: user });
    }else{
        res.status(200).json({ status:"error", message:"Wrong password" });
    }
}