import { Message } from "../../domain/Messages";
import { ProtectedAxiosInstance } from "../utils/ProtectedAxiosInstance";

interface MessagesRestResponse<T> {
    status: string;
    data: T;
};

export class MessagesRest {
    axios: ProtectedAxiosInstance;
    constructor(axios: ProtectedAxiosInstance){
        this.axios = axios;
    }

    async send_image(chat_id: string,image: File) : Promise<MessagesRestResponse<Message>>{
        let form = new FormData();

        form.append('image', image);
        form.append('chat_id', chat_id);

        return await this.axios.post<MessagesRestResponse<Message>, FormData>('/api/v1/chat/send_image', form).then(response => response.data);
    }
};