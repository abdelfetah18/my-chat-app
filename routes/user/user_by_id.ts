import { NextFunction, Response } from "express";
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { UserSession } from "../../domain/UsersSessions";
import { UserSessionRequest } from "../../domain/UserSessionRequest";

const basePath = process.env.INIT_CWD;
let PRIVATE_KEY  = fs.readFileSync(basePath+'/secret/private.key', 'utf8');

export default (req: UserSessionRequest,res: Response,next: NextFunction) => {
    let access_token = req.cookies.access_token || undefined; 
    if(access_token == undefined){
        res.status(200).json({ status: 'error', message: "access_token is missing." });
        return;
    }
    
    jwt.verify(access_token, PRIVATE_KEY, { algorithms: ['RS256'] }, (error, data) => {
        if(error){
            res.status(200).json({ status:'error', error });
            return;
        }
       
        req.userSession = data as UserSession;
        next();
    });
}