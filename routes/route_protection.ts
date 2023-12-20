import jwt from 'jsonwebtoken';
import { NextFunction, Response } from 'express';
import { UserSession } from '../domain/UsersSessions';
import { UserSessionRequest } from '../domain/UserSessionRequest';

let JWT_KEY  = process.env.JWT_KEY;

export default function(req: UserSessionRequest, res: Response, next: NextFunction){
    let protected_paths = ['/','/home','/explore','/create_room','/chat','/rooms','/friends','/settings'];
    if(!protected_paths.includes(req.path)){
        next();
        return;
    }

    let access_token = req.cookies.access_token || undefined;
    if(access_token == undefined){
        if(req.path == "/"){
            res.redirect("/sign_in");
            return;
        }
        res.status(200).json({ status: 'error', message: "access_token is missing." });
        return;
    }

    jwt.verify(access_token, JWT_KEY, { algorithms: ['HS256'] }, (error, data) => {
        if(error){
            res.redirect("/sign_in");
            return;
        }
       
        req.userSession = data as UserSession;
        next();
    });
}