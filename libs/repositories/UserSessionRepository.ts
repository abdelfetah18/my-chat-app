import DatabaseClient from "../../domain/DatabaseClient";
import { User } from "../../domain/Users";
import UsersSessions, { UserCredentials, UserSession } from "../../domain/UsersSessions";
import JWT from "jsonwebtoken"
import bcrypt from "bcrypt";
import { USER_PROPS } from "../database/props";

export default class UsersSessionsRepository implements UsersSessions {
    client: DatabaseClient;
    constructor(client: DatabaseClient){
        this.client = client
    }

    async signIn(userCredentials: UserCredentials): Promise<UserSession> {
        let username_and_password = await this.client.get<{ username: string }, UserCredentials>(`*[_type=="user" && username==$username]{ username, password }[0]`,{ username: userCredentials.username });
        if(!username_and_password){
            return { access_token: '' };
        }

        let verify_password = await bcrypt.compare(userCredentials.password, username_and_password.password);
        if(!verify_password){
            return { access_token: '' };
        }

        let user = await this.client.get<{ username: string }, User>(`*[_type=="user" && username==$username]${USER_PROPS}[0]`,{ username: userCredentials.username });
        let access_token = JWT.sign({ user_id: user._id, username: user.username }, process.env.JWT_KEY, { algorithm:"HS256", expiresIn: 1000*60*60*24 });
        
        return { access_token, user_id: user._id };
    }

    async signUp(user: User): Promise<User> {
        return await this.client.add<User>("user", user);
    }
}