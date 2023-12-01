import jwt from 'jsonwebtoken';
import fs from 'fs';
import { NextFunction, Request, Response } from 'express';

const basePath = process.env.INIT_CWD;
let PRIVATE_KEY  = fs.readFileSync(basePath+'/secret/private.key', 'utf8');

export default (req: Request,res: Response,next: NextFunction) => {
    if(req.cookies.access_token == undefined && req.headers.authorization){
        res.status(200).json({ status: "error", message: "Not authorized" });
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