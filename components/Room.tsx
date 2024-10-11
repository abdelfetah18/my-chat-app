import { FaGlobeAfrica, FaLock, FaUserFriends } from "react-icons/fa";
import { Room as RoomInterface } from "../domain/Rooms";
import SubmitButton, { SubmitButtonResult } from "./SubmitButton";

interface RoomProps {
    room: RoomInterface;
    onClick: () => Promise<SubmitButtonResult>;
};

export default function Room({ room, onClick }: RoomProps) {
    return (
        <div className="h-full flex flex-col items-center">
            <div className="h-full flex flex-col w-full items-center rounded-lg">
                <div className="w-full">
                    <img alt="profile_image" className="object-cover w-full rounded-lg" src={room.profile_image != null ? room.profile_image.url + "?h=400&w=400&fit=crop&crop=center" : "/profile.png"} />
                </div>
                <div className="font-medium text-black text-base w-full mt-1">{room.name}</div>
                <div className="text-gray-400 text-xs w-full">{room.bio}</div>
                <div className="w-full flex items-center justify-between mt-3">
                    <div className="text-black text-xs flex items-center gap-1">
                        {room.is_public ? (<FaGlobeAfrica />) : (<FaLock />)}
                        {room.is_public ? "Public" : "Private"}
                    </div>
                    <div className="text-black text-xs flex items-center gap-1">
                        <FaUserFriends />{room.total_members} Members
                    </div>
                </div>
                <div className="flex-grow"></div>
                <div className="w-full mt-6">
                    <SubmitButton key={crypto.randomUUID()} onClick={onClick} text={"JOIN"} className="bg-secondaryColor text-blue-50 text-sm w-full justify-center py-1 rounded-full text-center font-bold cursor-pointer active:scale-105 duration-300 hover:bg-primaryColor" />
                </div>
            </div>
        </div>
    );
}