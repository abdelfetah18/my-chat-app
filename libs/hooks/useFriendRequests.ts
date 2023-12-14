import { useContext, useEffect, useRef, useState } from "react";
import { ProtectedAxiosInstance } from "../utils/ProtectedAxiosInstance";
import UserSessionContext from "../contexts/UserSessionContext";
import { Friend } from "../../domain/Friends";
import { FriendsRest } from "../rest_api/FriendsRest";
import ToastContext from "../contexts/ToastContext";

export default function useFriendRequests() {
    const toastManager = useContext(ToastContext);
    const userSession = useContext(UserSessionContext);
    const [friendRequests, setFriendRequests] = useState<Friend[]>([]);
    const friendsRest = useRef<FriendsRest>(new FriendsRest(new ProtectedAxiosInstance(userSession.access_token)));

    useEffect(() => {
        friendsRest.current.getFriendRequests().then(response => {
            if (response.status == "success") {
                setFriendRequests(response.data);
            }
        });
    },[]);

    const acceptFriend = async (friend_id: string): Promise<Friend> => {
        let response = await friendsRest.current.accept(friend_id);
        if (response.status == "success") {
            toastManager.alertSuccess("Friend Request Accepted Successfuly");
            setFriendRequests(state => {
                let list = [...state];
                return list.filter(i => i._id != friend_id);
            });
            return response.data;
        }else{
            toastManager.alertError("Something went wrong");
        }
    }

    const rejectFriend = async (friend_id: string): Promise<Friend> => {
        let response = await friendsRest.current.reject(friend_id);
        if (response.status == "success") {
            setFriendRequests(state => {
                let list = [...state];
                return list.filter(i => i._id != friend_id);
            });
            return response.data;
        }
    }

    return { friendRequests, setFriendRequests, acceptFriend, rejectFriend };
}