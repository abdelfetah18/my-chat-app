import { Request, Response } from "express";
import { uploadImage } from '../../database/client';

export default async (req: Request,res: Response) => {
    try{
        let file_path = './'+req.file.path;
        let asset = await uploadImage(file_path);
        res.setHeader('Access-Control-Allow-Origin','*');
        res.status(200).json({ status:'success', message:'Uploaded successfuly!', ...asset });
    }catch(error){
        console.log({ error })
        res.status(200).json({ status: "error", error, message: "Something went wrong!" });
    }
}