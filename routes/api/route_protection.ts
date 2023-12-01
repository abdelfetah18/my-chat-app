import jwt from 'jsonwebtoken';
import fs from 'fs';
import { NextFunction, Request, Response } from 'express';

const basePath = process.env.INIT_CWD;
let PRIVATE_KEY  = fs.readFileSync(basePath+'/secret/private.key', 'utf8');

export default (req: Request,res: Response,next: NextFunction) => {
    let protected_paths = ['/create','/delete','/edit','/invite','/join','/leave','/chat_search'];
    if(!protected_paths.includes(req.path)){
        next();
        return;
    }

    let token = req.headers.authorization || req.cookies.access_token;
    if(token == undefined){
        res.status(401).json({ status: "error", message:'Not authorized!' });
        return;
    }
    
    jwt.verify(token,PRIVATE_KEY,{ algorithms: ['RS256'] },(error,data) => {
        if(error){
            res.status(200).json({ status:'error', error });
            return;
        }

        req.userSession = data as UserSession;
        next();
    });
}