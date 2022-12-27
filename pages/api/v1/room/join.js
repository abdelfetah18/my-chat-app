import { addData, getData } from "../../../../database/client";

export default function handler(req, res) {
    var user_info = req.decoded_jwt;
    var { room_id } = req.body;
    getData('*[_type == "rooms" && _id == $room_id]',{ room_id }).then(rooms => {
        if(rooms.length > 0){
            addData({
                _type:"room_members",
                state:'request',
                member: { _ref:user_info.user_id },
                room: { _ref:room_id },
                rule: "member"
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
            });
        }else{
            res.status(200).json({
                status: "failed",
                message: "room does not exist!"
            });
        }
    }).catch(err => {
        res.status(200).json({
            status:'error',
            message:'request failed!',
            error:err
        });
    });
}