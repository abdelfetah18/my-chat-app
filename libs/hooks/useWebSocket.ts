import { useContext, useEffect, useRef } from "react";
import UserSessionContext from "../contexts/UserSessionContext";


type WSPTarget = "chat";
type WSPAction = "sendMessage";

interface WSPayload {
    target: WSPTarget;
    action: WSPAction;
    data: any
};

export default function useWebSocket(chat_id?: string) {
    const userSession = useContext(UserSessionContext);
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (chat_id) {
            ws.current = new WebSocket((process.env.NODE_ENV != 'development' ? 'wss://my-chat-app.onrender.com' : 'ws://' + location.host.replace('3000', '4000')) + '/?chat_id=' + chat_id + '&access_token=' + userSession.access_token);
        }
    }, [chat_id]);

    const send = (target: WSPTarget, action: WSPAction, data: any): void => {
        ws.current.send(JSON.stringify({ target, action, data } as WSPayload));
    }

    return { ws, send };
}