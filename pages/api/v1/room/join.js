import { addData } from "../../../../database/client";

export default function handler(req, res) {
    var user_info = req.decoded_jwt;
    var { room_id } = req.body;
    addData({
        _type:"room_members",
        state:'request',
        member: { _ref:user_info.user_id },
        room: { _ref:room_id }
    }).then((response) => {
        res.status(200).json({
            status:'success',
            message:'request send successfuly!',
            data:response
        });
    }).catch((err) => {
        res.status(200).json({
            status:'error',
            message:'request failed!',
            error:err
        });
    })
}