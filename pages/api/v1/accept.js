import { updateData } from "../../../database/client";

export default function handler(req, res) {
    var { type } = req.query;
    switch (type){
        case "room":
            var { request_id } = req.body;
            updateData(request_id,{
                _type:"room_members",
                state:'accept'
            }).then((result) => {
                res.status(200).json({ status:'success',message:'user accepted successfuly!',data:result });
            });
            break;
        case "friend":
            var { chat_id } = req.body;
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