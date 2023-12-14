import { createContext } from "react";
import { UserSession } from "../../domain/UsersSessions";

export default createContext<UserSession>({ access_token: '' });