import { Response } from "express";
import { roomsRepository } from "../../../repository";
import { UserSessionRequest } from "../../../domain/UserSessionRequest";

export default async (req: UserSessionRequest,res: Response) => {
    let { room_id } = req.body;

    try{
        let file_path = './'+req.file.path;

        let asset = await roomsRepository.uploadProfileImage(room_id, file_path);

        res.setHeader('Access-Control-Allow-Origin','*');
        res.status(200).json({ status:'success', message:'Uploaded successfuly!', data: asset });
    }catch(error){
        console.log({error})
        res.status(200).json({ status: "error", error, message: "Something went wrong!" });
    }
}