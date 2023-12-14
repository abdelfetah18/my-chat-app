import { useContext, useEffect, useRef, useState } from "react";
import { Chat } from "../../domain/Chats";
import { ProtectedAxiosInstance } from "../utils/ProtectedAxiosInstance";
import UserSessionContext from "../contexts/UserSessionContext";
import { ChatsRest } from "../rest_api/ChatsRest";
import { MessagesRest } from "../rest_api/MessagesRest";
import { Message } from "../../domain/Messages";
import { WSPayload } from "../../websocket/WSClient";
import UserContext from "../contexts/UserContext";

export default function useChat(chat_id: string) {
    const userSession = useContext(UserSessionContext);
    const user = useContext(UserContext);
    const chatsRest = useRef<ChatsRest>(new ChatsRest(new ProtectedAxiosInstance(userSession.access_token)));
    const messagesRest = useRef<MessagesRest>(new MessagesRest(new ProtectedAxiosInstance(userSession.access_token)));
    const [chat, setChat] = useState<Chat>({ _id: '', theme: '', bio: 'Welcome to the chat', messages: [], target: { username: 'User', profile_image: null } });
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (chat_id) {
            ws.current = new WebSocket((process.env.NODE_ENV != 'development' ? 'wss://my-chat-app.onrender.com' : 'ws://' + location.host.replace('3000', '4000')) + '/?chat_id=' + chat_id + '&access_token=' + userSession.access_token);
            ws.current.addEventListener("message", (ev: MessageEvent) => {
                let payload: WSPayload = JSON.parse(ev.data);
                addMessage(payload.data);
            });
        }
        
        chatsRest.current.getChatById(chat_id, 0).then(response => {
            if (response.status == "success") {
                setChat(response.data);
            }
        })
    }, [chat_id]);

    const addMessage = (message: Message) => {
        setChat(state => {
            return {
                ...state,
                messages: [
                    ...state.messages,
                    {
                        ...message,
                        user,
                        _createdAt: (new Date()).toLocaleString("en-us")
                    }
                ]
            };
        });
    }

    const sendImage = async (image: File): Promise<Message> => {
        let response = await messagesRest.current.send_image(chat_id, image);
        if (response.status == "success") {
            return response.data;
        }
    }

    const sendMessage = async (message: Message) => {
        addMessage(message);
        ws.current.send(JSON.stringify({ target: "chat", action: "sendMessage", data: message } as WSPayload));
    }

    return { chat, setChat, sendImage, sendMessage };
}