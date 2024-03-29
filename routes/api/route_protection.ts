import jwt from 'jsonwebtoken';
import { NextFunction, Response } from 'express';
import { UserSession } from '../../domain/UsersSessions';
import { UserSessionRequest } from '../../domain/UserSessionRequest';

let JWT_KEY = process.env.JWT_KEY;

export default (req: UserSessionRequest, res: Response, next: NextFunction) => {
    let protected_paths = ['/create', '/delete', '/edit', '/invite', '/join', '/leave', '/rooms'];
    if (!protected_paths.includes(req.path)) {
        next();
        return;
    }

    let token = req.headers.authorization || req.cookies.access_token;
    if (token == undefined) {
        res.status(401).json({ status: "error", message: 'Not authorized!' });
        return;
    }

    jwt.verify(token, JWT_KEY, { algorithms: ['HS256'] }, (error, data) => {
        if (error) {
            res.status(200).json({ status: 'error', error });
            return;
        }

        req.userSession = data as UserSession;
        next();
    });
}