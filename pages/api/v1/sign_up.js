import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";

import { addData,getData } from "../../../database/client";

export default function handler(req, res) {
    var { username,password,birthdate } = req.body;
    getData('*[_type == "users" && username == $username]',{ username }).then(async (user) => {
        if(user.length > 0){
            res.status(200).json({
                status:'error',
                message:'username already in use!'
            })
        }else{
            var salt = await bcrypt.genSalt();
            var hashed_password = await bcrypt.hash(password,salt);
            var user_doc = { _type:'users',username,password:hashed_password,birthdate };
            addData(user_doc).then((result) => {
                res.status(200).json({
                    status:'success',
                    message:'user created successfuly!',
                    data:result
                });
            }).catch((err) => {
                res.status(200).json({
                    status:'fail',
                    message:'something went wrong!',
                    error:err
                });
            });
        }
    }).catch((err) => {
        console.log(err)
        res.status(200).json({
            status:'error',
            message:'something went wrong!',
            error:err
        });
    })
    
}