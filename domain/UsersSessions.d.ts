interface UserSession {
    access_token: string;
    user_id?: string;
}

interface UserCredentials {
    username: string;
    password: string;
}

import DatabaseClient, { RefDocument } from "./DatabaseClient";
import { User } from "./Users";

export default class UsersSessions {
    client: DatabaseClient;

    signIn(userCredentials: UserCredentials) : Promise<UserSession>;
    signUp(user: User) : Promise<User>;
}