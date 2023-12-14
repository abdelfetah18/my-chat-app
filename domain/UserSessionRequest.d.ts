import { Request } from "express";
import { UserSession } from "./UsersSessions";

interface UserSessionRequest extends Request {
    userSession: UserSession
}