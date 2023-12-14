import bcrypt from "bcrypt";
import { usersRepository, usersSessionsRepository } from "../../../repository";

// FIXME: Move this function to utils.
function validateInput(data){
    if(data.username.length == 0){
        return { status: "error", message: "Username was not provided." };
    }

    if(data.email.length == 0){
        return { status: "error", message: "Email was not provided." };
    }

    if(data.password.length < 6){
        return { status: "error", message: "Password length must be at least 6." };
    }

    if(data.birthdate.length == 0){
        return { status: "error", message: "Birthdate was not provided." };
    }

    if(!data.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)){
        return { status: "error", message: "Email is not valid." };
    }

    return { status: "success" };
}

export default async function handler(req, res) {
    let { username, bio, email, password, birthdate } = req.body;
    
    let result = validateInput(req.body);
    
    if(result.status == "error"){
        res.status(200).json(result);
        return;
    }

    let salt = await bcrypt.genSalt();
    let hashed_password = await bcrypt.hash(password, salt);
    
    let users = await usersRepository.getByUsername(username);
    if(users){
        res.status(200).json({ status: 'error', message: 'Username already used' });
    }

    let user = await usersSessionsRepository.signUp({ username, password: hashed_password, bio, email, birthdate });
    
    res.status(200).json({ status: 'success', message: 'Sign up success', data: user });
}