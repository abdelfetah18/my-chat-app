import { updateData, getData } from "../../../../database/client";

export default function handler(req, res) {
    var user_info = req.decoded_jwt;
    var { room_id, room_name, room_bio } = req.body;
    
    getData('*[_type=="rooms" && _id == $room_id && admin._ref == $user_id]', { room_id, user_id: user_info.user_id }).then((result) => {
        if(result.length > 0){
            updateData(room_id,{ name: room_name, bio: room_bio }).then(data => {
                res.status(200).json({
                    status: "success",
                    message: "room info edited successfuly!",
                    data
                });
            }).catch(err => {
                res.status(200).json({
                    status: "error",
                    message: "something went wrong!"
                });
            });
        }else{
            res.status(200).json({ 
                status: "failed",
                message: "you are not allowed to perform this action!"
            });
        }
    }).catch((err) => {
        res.status(200).json({
            status: "error",
            message: "something went wrong!"
        });
    });
}