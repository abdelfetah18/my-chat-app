import { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { UserRest } from "../rest_api/UserRest";
import { ProtectedAxiosInstance } from "../utils/ProtectedAxiosInstance";
import UserSessionContext from "../contexts/UserSessionContext";
import { User } from "../../domain/Users";

let updateUser = async (): Promise<void> => { };
let resetUser = async (): Promise<void> => { };
let upload_cover_image = async (cover_image: File): Promise<Asset> => { cover_image; return { url: '' } };
let upload_profile_image = async (profile_image: File): Promise<Asset> => { profile_image; return { url: '' } };

interface ReturnValue {
    user: User;
    setUser: Dispatch<SetStateAction<User>>;
    updateUser: () => Promise<void>;
    resetUser: () => Promise<void>;
    upload_cover_image: (cover_image: File) => Promise<Asset>;
    upload_profile_image: (profile_image: File) => Promise<Asset>;
};

export default function useUser(): ReturnValue {
    const userSession = useContext(UserSessionContext);
    let [user, setUser] = useState<User>({ username: 'user', bio: 'bio', cover_image: { url: '' }, profile_image: { url: '' }, friends: 0, rooms: 0, _createdAt: '' });
    let userRestRef = useRef(new UserRest(new ProtectedAxiosInstance(userSession.access_token)));

    updateUser = async (): Promise<void> => {
        await userRestRef.current.update(user);
    }

    resetUser = async (): Promise<void> => {
        let response = await userRestRef.current.get();
        if (response.status == "success") {
            setUser(response.data);
        }
    }

    upload_cover_image = async (cover_image: File): Promise<Asset> => {
        let response = await userRestRef.current.upload_cover_image(cover_image);
        if (response.status == "success") {
            setUser(state => ({ ...state, cover_image: response.data }));
            return response.data;
        }
    }

    upload_profile_image = async (profile_image: File): Promise<Asset> => {
        let response = await userRestRef.current.upload_profile_image(profile_image);
        if (response.status == "success") {
            setUser(state => ({ ...state, profile_image: response.data }));
            return response.data;
        }
    }


    useEffect(() => {
        userRestRef.current.get().then(response => {
            if (response.status == "success") {
                setUser(response.data);
            }
        })
    }, []);

    return {
        user,
        setUser,
        updateUser,
        resetUser,
        upload_cover_image,
        upload_profile_image
    };
}