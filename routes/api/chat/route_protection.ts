import jwt from 'jsonwebtoken';
import fs from 'fs';
import { NextFunction, Response } from 'express';
import { UserSession } from '../../../domain/UsersSessions';
import { UserSessionRequest } from '../../../domain/UserSessionRequest';

const basePath = process.env.INIT_CWD;
let PRIVATE_KEY  = fs.readFileSync(basePath+'/secret/private.key', 'utf8');

export default (req: UserSessionRequest,res: Response,next: NextFunction) => {
    if(req.cookies.access_token == undefined){
        res.status(401).redirect('/sign_in');
        return;
    }

    jwt.verify(req.cookies.access_token, PRIVATE_KEY,{ algorithms: ['RS256'] },(error, data) => {
        if(error){
            res.status(200).json({ status: 'error', error });
            return;
        }
        
        req.userSession = data as UserSession;
        next();
    });
}