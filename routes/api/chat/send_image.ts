import { Response } from "express";
import { messagesRepository } from "../../../repository";
import { UserSessionRequest } from "../../../domain/UserSessionRequest";

export default async (req: UserSessionRequest,res: Response) => {
    let userSession = req.userSession;
    let { chat_id } = req.body;

    try{
        let file_path = './'+req.file.path;

        let message = await messagesRepository.createMessage({ chat: { _type: "reference", _ref: chat_id }, message_content: '', message_type: "image", user: { _type: "reference", _ref: userSession.user_id }});
        await messagesRepository.uploadImage(message._id, file_path);
        message = await messagesRepository.getById(message._id);

        res.setHeader('Access-Control-Allow-Origin','*');
        res.status(200).json({ status:'success', message:'Uploaded successfuly!', data: message });
    }catch(error){
        console.log({error})
        res.status(200).json({ status: "error", error, message: "Something went wrong!" });
    }
}