import { useContext, useEffect, useState } from "react";
import { Room } from "../../domain/Rooms";
import { RoomsRest } from "../rest_api/RoomsRest";
import { ProtectedAxiosInstance } from "../utils/ProtectedAxiosInstance";
import UserSessionContext from "../contexts/UserSessionContext";

export default function useRooms(){
    const userSession = useContext(UserSessionContext);
    const roomsRest = new RoomsRest(new ProtectedAxiosInstance(userSession.access_token));
    const [rooms, setRooms] = useState<Room[]>([]);

    useEffect(() => {
        let pathname = location.pathname;
        let parts = pathname.split('/');
        let room_id = undefined;
        if(parts.length > 2){
            room_id = parts[2];
        }

        roomsRest.getMyRooms(room_id).then(response => {
            if(response.status == "success"){
                setRooms(response.data);
            }
        });
    },[]);

    return { rooms, setRooms };
}