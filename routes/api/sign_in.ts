import { NextFunction, Response } from "express";
import { UserSessionRequest } from "../../domain/UserSessionRequest";

export default (req: UserSessionRequest,res: Response,next: NextFunction) => {
    if(req.method == "POST")
        next();
    else
        res.status(405).json({ message:'method not allowed!' });
}