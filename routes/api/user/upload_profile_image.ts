import { Response } from "express";
import { usersRepository } from "../../../repository";
import { UserSessionRequest } from "../../../domain/UserSessionRequest";

export default async (req: UserSessionRequest,res: Response) => {
    try{
        let file_path = './'+req.file.path;
        let user_info = req.userSession;
    
        let asset = await usersRepository.uploadProfileImage(user_info.user_id, file_path);

        res.setHeader('Access-Control-Allow-Origin','*');
        res.status(200).json({ status:'success', message:'Uploaded successfuly!', data: asset });
    }catch(error){
        res.status(200).json({ status: "error", error, message: "Something went wrong!" });
    }
}