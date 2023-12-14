import { Room } from "../domain/Rooms";
import SubmitButton, { SubmitButtonResult } from "./SubmitButton";

interface RoomProps {
    room: Room;
    onClick: () => Promise<SubmitButtonResult>;
};

export default function Room({ room, onClick } : RoomProps){
    return (
        <div className="flex flex-col items-center lg:w-1/6 md:w-1/4 w-full mb-8">
            <div className="flex flex-col w-11/12 shadow-lg items-center rounded-lg">
                <div className="w-full">
                    <img alt="profile_image" className="object-cover w-full rounded-t-lg" src={room.profile_image != null ? room.profile_image.url+"?h=400&w=400&fit=crop&crop=center" : "/profile.png"} />
                </div>
                <div className="font-mono font-semibold text-base mt-2 w-full px-2">{room.name}</div>
                <div className="font-mono text-gray-400 text-xs mb-2 w-full px-2">{room.total_members} Members</div>
                <div className="w-full px-2 my-2">
                    <SubmitButton key={crypto.randomUUID()} wrapperClassName={''} onClick={onClick} text={"JOIN"} className="bg-blue-600 text-blue-50 text-sm w-full justify-center py-2" />
                </div>
            </div>
        </div>
    );
}