import { User } from "../../domain/Users";
import { ProtectedAxiosInstance } from "../utils/ProtectedAxiosInstance";

interface UserRestResponse<T> {
    status: string;
    data: T;
};

export class UserRest {
    axios: ProtectedAxiosInstance;
    constructor(axios: ProtectedAxiosInstance){
        this.axios = axios;
    }

    async get(): Promise<UserRestResponse<User>> {
        return await this.axios.get<UserRestResponse<User>>("/api/v1/user").then(response => response.data);
    }

    async update(user: User): Promise<UserRestResponse<User>> {
        return await this.axios.post<UserRestResponse<User>, User>("/api/v1/user/update", user).then(response => response.data);
    }

    async upload_cover_image(cover_image: File): Promise<UserRestResponse<Asset>>{
        let form = new FormData();
        form.append('cover_image', cover_image);
        return await this.axios.post<UserRestResponse<Asset>, FormData>('/api/v1/user/upload_cover_image', form).then(response => response.data);
    }

    async upload_profile_image(profile_image: File): Promise<UserRestResponse<Asset>>{
        let form = new FormData();
        form.append('profile_image', profile_image);
        return await this.axios.post<UserRestResponse<Asset>, FormData>('/api/v1/user/upload_profile_image', form).then(response => response.data);
    }
};