import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { UserSessionLocalStorage } from "../storage/UserSessionLocalStorage";
import { UserSessionRest } from "../rest_api/UserSessionRest";
import axios from "axios";
import { UserCredentials, UserSession } from "../../domain/UsersSessions";
import { User } from "../../domain/Users";

interface Result<T> {
    status: "success" | "error";
    message?: string;
    data?: T;
}

interface ReturnValue {
    userSession: UserSession;
    setUserSession: Dispatch<SetStateAction<UserSession>>;
    signIn: (userCredentials: UserCredentials) => Promise<Result<UserSession>>;
    signUp: (user: User) => Promise<Result<User>>;
};

export default function useUserSession() : ReturnValue {
    const [userSession, setUserSession] = useState<UserSession>({ access_token: '' });
    const userSessionLocalStorage = useRef<UserSessionLocalStorage>(null);
    const userSessionRest = useRef<UserSessionRest>(new UserSessionRest(axios));

    useEffect(() => {
        userSessionLocalStorage.current = new UserSessionLocalStorage(localStorage);
        let _userSession = userSessionLocalStorage.current.get();
        
        if(_userSession instanceof Error){
            if(!(['/sign_in','/sign_up'].includes(window.location.pathname)))
                window.location.href = '/sign_in';
        }

        setUserSession(_userSession as UserSession);
    },[]);

    const signIn = async (userCredentials: UserCredentials) : Promise<Result<UserSession>> => {
        let response = await userSessionRest.current.sign_in(userCredentials);
        if(response.status == "success"){
            setUserSession(response.data);
            userSessionLocalStorage.current.set(response.data);
            return { status: "success", data: response.data };
        }
        
        return { status: "error", message: response.message };
    }

    const signUp = async (user: User) : Promise<Result<User>> => {
        let response = await userSessionRest.current.sign_up(user);
        if(response.status == "success"){
            return { status: "success", data: response.data };
        }
        
        return { status: "error", message: response.message };
    }

    return { userSession, setUserSession, signIn, signUp };
}