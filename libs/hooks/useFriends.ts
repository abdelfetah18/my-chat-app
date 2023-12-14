import { useContext, useRef, useState } from "react";
import { ProtectedAxiosInstance } from "../utils/ProtectedAxiosInstance";
import UserSessionContext from "../contexts/UserSessionContext";
import { Friend } from "../../domain/Friends";
import { FriendsRest } from "../rest_api/FriendsRest";
import { User } from "../../domain/Users";

export default function useFriends() {
    const userSession = useContext(UserSessionContext);
    const [friends, setFriends] = useState<Friend[]>([]);
    const friendsRest = useRef<FriendsRest>(new FriendsRest(new ProtectedAxiosInstance(userSession.access_token)));

    const getFriendRequests = async (): Promise<Friend[]> => {
        let response = await friendsRest.current.getFriendRequests();
        if (response.status == "success") {
            return response.data;
        }
        return [];
    }

    const getPeopleMayKnow = async (): Promise<User[]> => {
        let response = await friendsRest.current.getPeopleMayKnow();
        if (response.status == "success") {
            return response.data;
        }
        return [];
    }

    const acceptFriend = async (friend_id: string): Promise<Friend> => {
        let response = await friendsRest.current.accept(friend_id);
        if (response.status == "success") {
            return response.data;
        }
    }

    const rejectFriend = async (friend_id: string): Promise<Friend> => {
        let response = await friendsRest.current.reject(friend_id);
        if (response.status == "success") {
            return response.data;
        }
    }

    const inviteFriend = async (user_id: string): Promise<Friend> => {
        let response = await friendsRest.current.invite(user_id);
        if (response.status == "success") {
            return response.data;
        }
    }

    return { friends, setFriends, getFriendRequests, getPeopleMayKnow, acceptFriend, rejectFriend, inviteFriend };
}