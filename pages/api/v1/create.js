import { getData,addData } from '../../../database/client';

export default function handler(req, res) {
    var user_info = req.decoded_jwt;
    var { room_name,room_bio } = req.body;
    getData('*[_type=="rooms" && name==$room_name]',{ room_name }).then((rooms) => {
        if(rooms.length > 0){
            res.status(200).json({
                status:'fail',
                message:'name already used!'
            });
        }else{
            var room_doc = { _type:'rooms',name:room_name,bio:room_bio,admin:{ _ref:user_info.user_id },creator:{ _ref:user_info.user_id }};
            addData(room_doc).then((room) => {
                var member_doc = {_type:'room_members',room:{ _ref:room._id,member:{ _ref:user_info.user_id } }};
                addData(member_doc).then((mebmer) => {
                    res.status(200).json({
                        status:'success',
                        message:'room created successfuly!'
                    });
                }).catch((err) => {
                    res.status(200).json({
                        status:'error',
                        message:'something went wrong!',
                        error:err
                    })
                })
            }).catch((err) => {
                res.status(200).json({
                    status:'error',
                    message:'something went wrong!',
                    error:err
                })
            })
        }
    }).catch((err) => {
        res.status(200).json({
            status:'error',
            message:'something went wrong!',
            error:err
        })
    })
}