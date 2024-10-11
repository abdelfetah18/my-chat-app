import { Friend } from "../../domain/Friends";
import { User } from "../../domain/Users";
import { ProtectedAxiosInstance } from "../utils/ProtectedAxiosInstance";

interface FriendsRestResponse<T> {
    status: string;
    data: T;
};

export class FriendsRest {
    axios: ProtectedAxiosInstance;
    constructor(axios: ProtectedAxiosInstance){
        this.axios = axios;
    }

    async getPeopleMayKnow() : Promise<FriendsRestResponse<User[]>> {
        return await this.axios.get<FriendsRestResponse<User[]>>('/api/v1/user/people_may_know').then(response => response.data);
    }

    async getFriendRequests() : Promise<FriendsRestResponse<Friend[]>> {
        return await this.axios.get<FriendsRestResponse<Friend[]>>('/api/v1/user/friend_requests').then(response => response.data);
    }

    async accept(friend_id: string): Promise<FriendsRestResponse<Friend>> {
        return await this.axios.post<FriendsRestResponse<Friend>,{ friend_id: string }>('/api/v1/user/accept', { friend_id }).then(response => response.data);
    }

    async reject(friend_id: string): Promise<FriendsRestResponse<Friend>> {
        return await this.axios.post<FriendsRestResponse<Friend>,{ friend_id: string }>('/api/v1/user/reject', { friend_id }).then(response => response.data);
    }

    async invite(user_id: string): Promise<FriendsRestResponse<Friend>> {
        return await this.axios.post<FriendsRestResponse<Friend>,{ friend_id: string }>('/api/v1/user/invite', { friend_id: user_id }).then(response => response.data);
    }

    async getAllFriends():Promise<FriendsRestResponse<Friend[]>> {
        return await this.axios.get<FriendsRestResponse<Friend[]>>('/api/v1/user/friends').then(response => response.data);
    }
};