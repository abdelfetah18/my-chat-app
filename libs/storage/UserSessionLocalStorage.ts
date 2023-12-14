import { UserSession } from "../../domain/UsersSessions";

const ACCESS_TOKEN_KEY = "access_token";
const USER_ID_KEY = "user_id";

export class UserSessionLocalStorage {
    localStorage: Storage;
    constructor(localStorage: Storage){
        this.localStorage = localStorage;
    }

    set(userSession: UserSession) : void {
        this.localStorage.setItem(ACCESS_TOKEN_KEY, userSession.access_token);
        this.localStorage.setItem(USER_ID_KEY, userSession.user_id);
    }

    get() : UserSession | Error {
        let access_token = this.localStorage.getItem(ACCESS_TOKEN_KEY);
        let user_id = this.localStorage.getItem(USER_ID_KEY);
        
        if(!access_token){
            return new Error('No access_token found.');
        }
        
        if(user_id){
            return { access_token, user_id };
        }

        return { access_token };
    }
};