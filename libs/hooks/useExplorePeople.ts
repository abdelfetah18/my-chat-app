import { useContext, useEffect, useRef, useState } from "react";
import { ProtectedAxiosInstance } from "../utils/ProtectedAxiosInstance";
import UserSessionContext from "../contexts/UserSessionContext";
import { Friend } from "../../domain/Friends";
import { FriendsRest } from "../rest_api/FriendsRest";
import { User } from "../../domain/Users";
import ToastContext from "../contexts/ToastContext";

export default function useExplorePeople() {
    const toastManager = useContext(ToastContext);
    const userSession = useContext(UserSessionContext);
    const [peopleMayKnow, setPeopleMayKnow] = useState<User[]>([]);
    const friendsRest = useRef<FriendsRest>(new FriendsRest(new ProtectedAxiosInstance(userSession.access_token)));

    useEffect(() => {
        friendsRest.current.getPeopleMayKnow().then(response => {
            if (response.status == "success") {
                setPeopleMayKnow(response.data);
            }
        });
    }, []);

    const inviteFriend = async (user_id: string): Promise<Friend> => {
        let response = await friendsRest.current.invite(user_id);
        if (response.status == "success") {
            toastManager.alertSuccess("Friend request sent successfuly.");

            setPeopleMayKnow(state => {
                let list = [...state];
                return list.filter(u => u._id != user_id);
            });

            return response.data;
        }
        toastManager.alertError("Something went wron.");
    }

    return { peopleMayKnow, setPeopleMayKnow, inviteFriend };
}