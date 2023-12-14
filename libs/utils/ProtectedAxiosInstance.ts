import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export type ProtectedAxiosInstanceResponse<T> = AxiosResponse<T>;

export class ProtectedAxiosInstance {
    private axiosInstance: AxiosInstance;
    constructor(private access_token: string) {
        this.axiosInstance = this.setupAxios();
    }

    async get<Result>(uri: string, config = {}): Promise<AxiosResponse<Result>> {
        return this.axiosInstance.get<Result>(uri, config);
    }

    async put<Result, Payload = never>(uri: string, data?: Payload): Promise<AxiosResponse<Result>> {
        return this.axiosInstance.put<Result>(uri, data);
    }

    async post<Result, Payload = never>(uri: string, data?: Payload, config?: AxiosRequestConfig): Promise<AxiosResponse<Result>> {
        return this.axiosInstance.post<Result>(uri, data, config);
    }

    async delete<Result>(uri: string): Promise<AxiosResponse<Result>> {
        return this.axiosInstance.delete<Result>(uri);
    }

    private setupAxios(): AxiosInstance {
        axios.defaults.headers.common['Authorization'] = `${this.access_token}`;
        return axios;
    }
}