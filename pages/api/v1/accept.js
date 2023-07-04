import { updateData } from "../../../database/client";

export default function handler(req, res) {
    let { type } = req.query;
    switch (type){
        case "room":
            let { request_id } = req.body;
            updateData(request_id,{
                _type:"room_members",
                state:'accept'
            }).then((result) => {
                res.status(200).json({ status:'success',message:'user accepted successfuly!',data:result });
            });
            break;
        case "friend":
            let { chat_id } = req.body;
            updateData(chat_id,{
                _type:"chats",
                state:'accept'
            }).then((result) => {
                res.status(200).json({ status:'success',message:'user accepted successfuly!',data:result });
            });
            break;
        default:
            break;
    }
}