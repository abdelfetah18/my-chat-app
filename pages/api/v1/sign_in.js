import JWT from "jsonwebtoken"
import { getData } from "../../../database/client";
import bcrypt from "bcrypt";
import { privateKEY,publicKEY } from '../../../secret';

export default function handler(req, res) {
    var { username:_username,password } = req.body;
    getData('*[_type=="users" && username==$username]',{ username:_username }).then((user) => {
        console.log('user:',user);
        if(user.length > 0){
            var { _id:user_id,username,password:encrypted_pwd } = user[0];
            bcrypt.compare(password,encrypted_pwd).then((is_equal) => {
                if(is_equal){
                    var token = JWT.sign({ user_id,username },privateKEY,{
                        algorithm:"RS256",
                        expiresIn:1000*60*60*24,
                    })
                    res.status(200).json({
                        status:"success",
                        message:"user sign_in!",
                        token,
                        user_info:user[0]
                    });
                }else{
                    res.status(200).json({
                        status:'error',
                        message:'bad password!'
                    })
                }
            }).catch((err) => {
                res.status(200).json({
                    status:'error',
                    message:'something went wrong!',
                    error:err
                });
            })
        }else{
            res.status(200).json({
                status:'error',
                message:'user not found!'
            });
        }
    }).catch((err) => {
        res.status(200).json({
            status:'fail',
            message:'some thing went wrong!',
            error:err
        })
    })
    
}