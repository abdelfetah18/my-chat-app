import { useContext, useEffect, useState } from "react";
import { Room } from "../../domain/Rooms";
import { RoomsRest } from "../rest_api/RoomsRest";
import { ProtectedAxiosInstance } from "../utils/ProtectedAxiosInstance";
import UserSessionContext from "../contexts/UserSessionContext";
import { RoomMember } from "../../domain/RoomMembers";

export default function useRoom(room_id?: string | undefined) {
    const userSession = useContext(UserSessionContext);
    const [room, setRoom] = useState<Room>({ name: '', bio: '', is_public: true, admin: { _id: '', username: '', bio: '' }, total_members: 0, _createdAt: new Date() });
    const roomsRest = new RoomsRest(new ProtectedAxiosInstance(userSession.access_token));
    const [members, setMembers] = useState<RoomMember[]>([]);

    useEffect(() => {
        if (!room_id) {
            return;
        }

        roomsRest.getRoomMembers(room_id).then(response => {
            if (response.status == "success") {
                setMembers(response.data);
            }
        });

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
        let response = await roomsRest.create({ ...room, profile_image: undefined, cover_image: undefined });
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

    const updateRoom = async (): Promise<Room | null> => {
        let response = await roomsRest.update(room);
        if (response.status == "success") {
            return response.data;
        }
        return null;
    }

    return {
        room,
        members,
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