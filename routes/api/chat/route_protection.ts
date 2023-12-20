import jwt from 'jsonwebtoken';
import { NextFunction, Response } from 'express';
import { UserSession } from '../../../domain/UsersSessions';
import { UserSessionRequest } from '../../../domain/UserSessionRequest';

let JWT_KEY  = process.env.JWT_KEY;

export default (req: UserSessionRequest,res: Response,next: NextFunction) => {
    if(req.cookies.access_token == undefined){
        res.status(401).redirect('/sign_in');
        return;
    }

    jwt.verify(req.cookies.access_token, JWT_KEY,{ algorithms: ['HS256'] },(error, data) => {
        if(error){
            res.status(200).json({ status: 'error', error });
            return;
        }
        
        req.userSession = data as UserSession;
        next();
    });
}