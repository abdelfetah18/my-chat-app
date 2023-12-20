import { NextFunction, Response } from "express";
import jwt from 'jsonwebtoken';
import { UserSession } from "../../domain/UsersSessions";
import { UserSessionRequest } from "../../domain/UserSessionRequest";

let JWT_KEY  = process.env.JWT_KEY;

export default (req: UserSessionRequest,res: Response,next: NextFunction) => {
    let access_token = req.cookies.access_token || undefined; 
    if(access_token == undefined){
        res.status(200).json({ status: 'error', message: "access_token is missing." });
        return;
    }
    
    jwt.verify(access_token, JWT_KEY, { algorithms: ['HS256'] }, (error, data) => {
        if(error){
            res.status(200).json({ status:'error', error });
            return;
        }
       
        req.userSession = data as UserSession;
        next();
    });
}