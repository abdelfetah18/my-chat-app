import { useContext, useEffect, useRef, useState } from "react";
import { Friend } from "../../domain/Friends";
import UserSessionContext from "../contexts/UserSessionContext";
import { FriendsRest } from "../rest_api/FriendsRest";
import { ProtectedAxiosInstance } from "../utils/ProtectedAxiosInstance";

export default function useAllFriends() {
    const userSession = useContext(UserSessionContext);
    const [friends, setFriends] = useState<Friend[]>([]);
    const friendsRest = useRef<FriendsRest>(new FriendsRest(new ProtectedAxiosInstance(userSession.access_token)));

    useEffect(() => {
        getAllFriends();
    }, []);

    const getAllFriends = async () => {
        let response = await friendsRest.current.getAllFriends();
        if (response.status == "success") {
            setFriends(response.data);
        }

    }

    return { friends };
}