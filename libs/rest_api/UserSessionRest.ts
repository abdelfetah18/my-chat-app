import { AxiosInstance } from "axios";
import { UserCredentials, UserSession } from "../../domain/UsersSessions";
import { User } from "../../domain/Users";

interface UserSessionResponse<T> {
    status: string;
    data: T;
    message?: string;
};

export class UserSessionRest {
    axios: AxiosInstance;
    constructor(axios: AxiosInstance){
        this.axios = axios;
    }

    async sign_in(userCredentials: UserCredentials) : Promise<UserSessionResponse<UserSession>> {
        return await this.axios.post<UserSessionResponse<UserSession>>('/api/v1/sign_in', userCredentials).then(response => response.data);
    }

    async sign_up(user: User) : Promise<UserSessionResponse<User>> {
        return await this.axios.post<UserSessionResponse<User>>('/api/v1/sign_up', user).then(response => response.data);
    }
};