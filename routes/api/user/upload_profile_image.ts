import { Request, Response } from "express";
import { uploadProfile } from '../../../database/client';

export default async (req: Request,res: Response) => {
    let { user_id } = req.body;
    try{
        let file_path = './'+req.file.path;
        let asset = await uploadProfile(file_path, user_id);
        res.setHeader('Access-Control-Allow-Origin','*');
        res.status(200).json({ status:'success', message:'Uploaded successfuly!', data: asset });
    }catch(error){
        res.status(200).json({ status: "error", error, message: "Something went wrong!" });
    }
}