import { useContext } from "react";
import EditRoom from "./EditRoom";
import UserSessionContext from "../libs/contexts/UserSessionContext";
import { RoomsRest } from "../libs/rest_api/RoomsRest";
import { ProtectedAxiosInstance } from "../libs/utils/ProtectedAxiosInstance";
import { Icon } from "@iconify/react";

interface RoomSettingsProps {
    roomId: string;
}

export default function RoomSettings({ roomId }: RoomSettingsProps) {
    const userSession = useContext(UserSessionContext);
    const roomsRest = new RoomsRest(new ProtectedAxiosInstance(userSession.access_token));

    async function deleteRoomHandler(): Promise<void> {
        try {
            await roomsRest.delete(roomId);
            window.location.href = "/";
        } catch (error) {
            alert(error);
        }
    }

    return (
        <div className="w-full flex flex-row gap-2 overflow-auto">
            <div className="w-96 px-2 flex flex-col border-r border-zinc-200">
                <div className="bg-zinc-100 hover:bg-zinc-100 cursor-pointer rounded-lg p-2 text-base font-semibold">Room Information</div>
                <div className="w-full h-px bg-zinc-200 my-2"></div>
                <div onClick={deleteRoomHandler} className="hover:bg-zinc-100 cursor-pointer rounded-lg p-2 text-red-500 text-base font-semibold flex flex-row items-center gap-2">
                    <Icon icon={'lucide:trash-2'} />
                    <div>Delete Room</div>
                </div>
            </div>
            <div className="flex-grow flex flex-col px-2 overflow-auto">
                <EditRoom roomId={roomId} />
            </div>
        </div>
    );
}