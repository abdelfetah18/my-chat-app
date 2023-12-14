import { useContext, useEffect, useRef, useState } from "react";
import { Chat } from "../../domain/Chats";
import { ProtectedAxiosInstance } from "../utils/ProtectedAxiosInstance";
import UserSessionContext from "../contexts/UserSessionContext";
import { ChatsRest } from "../rest_api/ChatsRest";

export default function useChats() {
    const userSession = useContext(UserSessionContext);
    const [chats, setChats] = useState<Chat[]>([]);
    const chatsRest = useRef<ChatsRest>(new ChatsRest(new ProtectedAxiosInstance(userSession.access_token)));

    useEffect(() => {
        let pathname = location.pathname;
        let parts = pathname.split('/');
        let chat_id = undefined;
        if(parts.length > 2){
            chat_id = parts[2];
        }

        chatsRest.current.getRecent(chat_id).then(response => {
            if (response.status == "success") {
                setChats(response.data);
            }
        });
    }, []);

const search = async (query: string): Promise<void> => {
    let response = await chatsRest.current.getChatsByName(query);
    if (response.status == "success") {
        setChats(response.data);
    }
}

return { chats, setChats, search };
}