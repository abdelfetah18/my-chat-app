import { NextFunction, Request, Response } from "express";

export default (req: Request,res: Response,next: NextFunction) => {
    if(req.method == "POST")
        next();
    else
        res.status(405).json({ message:'method not allowed!' });
}