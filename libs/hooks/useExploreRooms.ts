import { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { Room } from "../../domain/Rooms";
import { RoomsRest } from "../rest_api/RoomsRest";
import { ProtectedAxiosInstance } from "../utils/ProtectedAxiosInstance";
import UserSessionContext from "../contexts/UserSessionContext";
import ToastContext from "../contexts/ToastContext";

interface ReturnValue {
    rooms: Room[];
    setRooms: Dispatch<SetStateAction<Room[]>>;
    joinRoom: (room_id: string) => Promise<void>;
};

export default function useExploreRooms() : ReturnValue {
    const toastManager = useContext(ToastContext);
    const userSession = useContext(UserSessionContext);
    const roomsRest = useRef(new RoomsRest(new ProtectedAxiosInstance(userSession.access_token)));
    const [rooms, setRooms] = useState<Room[]>([]);

    useEffect(() => {
        roomsRest.current.getExploreRooms().then(response => {
            console.log({ response })
            if(response.status == "success"){
                setRooms(response.data);
            }
        })
    },[]);

    const joinRoom = async (room_id: string) : Promise<void> => {
        await roomsRest.current.join(room_id);
        toastManager.alertSuccess("Joined successfuly");
        setRooms(state => {
            let list = [...state];
            return list.filter(r => r._id != room_id);
        });  
    }

    return { rooms, setRooms, joinRoom };
}