import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";

import { createUser } from "../../../database/client";

export default async function handler(req, res) {
    let { username, email, password, birthdate } = req.body;
    let salt = await bcrypt.genSalt();
    let hashed_password = await bcrypt.hash(password, salt);
    let user_doc = { username, email, password:hashed_password, birthdate };
    
    try{
        let data = await createUser(user_doc);
        if(data == null){
            res.status(200).json({ status: 'error', message: 'User already exist' });
            return;
        }
        res.status(200).json({ status: 'success', message: 'User account created successfuly!', data });
    }catch(error){
        console.log({ error });
        res.status(200).json({ status:'error', message:'Something went wrong!', error });
    }
}