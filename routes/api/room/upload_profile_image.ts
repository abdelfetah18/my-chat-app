import { Request, Response } from "express";

import { uploadProfile, getRoom } from '../../../database/client';

export default async (req: Request,res: Response) => {
    let { room_id } = req.body;

    try{
        let file_path = './'+req.file.path;
        let asset = await uploadProfile(file_path, room_id);
        res.setHeader('Access-Control-Allow-Origin','*');
        let room = await getRoom(room_id);
        res.status(200).json({ status:'success', message:'Uploaded successfuly!', data: room });
    }catch(error){
        console.log({error})
        res.status(200).json({ status: "error", error, message: "Something went wrong!" });
    }
}