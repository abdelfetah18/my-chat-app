import { NextFunction, Request, Response } from "express";
import fs from "fs";
import { getRoom } from "../../database/client";
import jwt from 'jsonwebtoken';

const basePath = process.env.INIT_CWD;
let PRIVATE_KEY  = fs.readFileSync(basePath+'/secret/private.key', 'utf8');

export default (req: Request,res: Response,next: NextFunction) => {
    if(req.cookies.access_token == undefined){
        res.status(200).json({ status: 'error', message: "access_token is missing." });
        return;
    }

    jwt.verify(req.cookies.access_token, PRIVATE_KEY,{ algorithms: ['RS256'] },(error, data) => {
        if(error){
            res.status(200).json({ status:'error', error });
            return;
        }
       
        req.userSession = data as UserSession;
    
        // TODO: Prevent unauthorized access to the room like when the user is not a member.
        getRoom(req.params.room_id).then((room) => {
            if(room){
                next();
                return;
            }
            
            res.status(200).json({ status:'error', message:"You are not a member!" });
        }).catch((error) => {
            res.status(200).json({ status:'error', error });
        })
    });
}