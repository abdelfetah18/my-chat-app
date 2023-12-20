import { useContext, useEffect, useState } from "react";
import { Room } from "../../domain/Rooms";
import { RoomsRest } from "../rest_api/RoomsRest";
import { ProtectedAxiosInstance } from "../utils/ProtectedAxiosInstance";
import UserSessionContext from "../contexts/UserSessionContext";

export default function useRoom(room_id?: string | undefined) {
    const userSession = useContext(UserSessionContext);
    const [room, setRoom] = useState<Room>({ name: '', bio: '', is_public: true, admin: { _id: '', username: '', bio: '' }, total_members: 0, _createdAt: new Date() });
    const roomsRest = new RoomsRest(new ProtectedAxiosInstance(userSession.access_token));

    useEffect(() => {
        if (!room_id) {
            return;
        }

        roomsRest.getById(room_id).then(response => {
            if (response.status == "success") {
                setRoom(response.data);
            }
        });
    }, [room_id]);

    const resetRoom = async (): Promise<void> => {
        let response = await roomsRest.getById(room_id);
        if (response.status == "success") {
            setRoom(response.data);
        }
    }

    const createRoom = async (): Promise<Room> => {
        let response = await roomsRest.create(room);
        if (response.status == "success") {
            return response.data;
        }
    }

    const upload_profile_image = async (room_id: string, profile_image: File): Promise<Asset> => {
        return await roomsRest.upload_profile_image(room_id, profile_image);
    }

    const upload_cover_image = async (room_id: string, cover_image: File): Promise<Asset> => {
        return await roomsRest.upload_cover_image(room_id, cover_image);
    }

    const leaveRoom = async () => {
        await roomsRest.leave(room._id);
    }

    const deleteRoom = async () => {
        await roomsRest.delete(room._id);
    }

    const updateRoom = async (): Promise<Room> => {
        let response = await roomsRest.update(room);
        if (response.status == "success") {
            return response.data;
        }
    }

    return {
        room,
        resetRoom,
        setRoom,
        createRoom,
        leaveRoom,
        deleteRoom,
        updateRoom,
        upload_profile_image,
        upload_cover_image
    };
}