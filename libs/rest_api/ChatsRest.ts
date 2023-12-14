import { Chat } from "../../domain/Chats";
import { ProtectedAxiosInstance } from "../utils/ProtectedAxiosInstance";

interface ChatsRestResponse<T> {
    status: string;
    data: T;
};

export class ChatsRest {
    axios: ProtectedAxiosInstance;
    constructor(axios: ProtectedAxiosInstance) {
        this.axios = axios;
    }

    async getRecent(chat_id?: string): Promise<ChatsRestResponse<Chat[]>> {
        if (chat_id) {
            return await this.axios.post<ChatsRestResponse<Chat[]>, { chat_id: string }>("/api/v1/chat/recent", { chat_id }).then(response => response.data);
        }
        return await this.axios.get<ChatsRestResponse<Chat[]>>("/api/v1/chat/recent").then(response => response.data);
    }

    async getChatsByName(query: string): Promise<ChatsRestResponse<Chat[]>> {
        return await this.axios.get<ChatsRestResponse<Chat[]>>(`/api/v1/chat/search?q=${query}`).then(response => response.data);
    }

    async getChatById(chat_id: string, offset: number): Promise<ChatsRestResponse<Chat>> {
        return await this.axios.get<ChatsRestResponse<Chat>>(`/api/v1/chat/${chat_id}?offset=${offset}`).then(response => response.data);
    }
};