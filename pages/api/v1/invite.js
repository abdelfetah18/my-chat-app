import { addData } from "../../../database/client";

export default function handler(req, res) {
    var { type } = req.query;
    switch (type){
        case "room":
            var { room_id,user_id } = req.body;
            break;
        case "friend":
            var { user_id } = req.body;
            addData({
                _type:'chats',
                inviter:{ _ref:req.decoded_jwt.user_id },
                user:{ _ref:user_id },
                state:'invite'
            }).then((result) => {
                res.status(200).json({ status:'success',message:'user invited successfuly!',data:result });
            })
            break;
        default:
            break;
    }
}