import axios from "axios";
import { useRef } from "react";
import SubmitButton from "../components/SubmitButton";

export default function ExploreRooms({ RoomsYouMayLike, User, updateContent }){
    if(RoomsYouMayLike.length == 0)
        return <></>

    return (
        <div className="w-full sm:w-11/12 flex flex-col my-2 sm:my-0">
            <div className="font-mono text-sm sm:text-lg font-semibold">Rooms you may like to join:</div>
            <div className="w-full flex flex-col">
                <div className="flex flex-row w-full p-2 flex-wrap">
                    {
                        RoomsYouMayLike.map((r, i) => <Room key={i} room={r} User={User} updateContent={updateContent} />)
                    }
                </div>
            </div>
        </div>
    )
}

const Room = ({ room, User, updateContent}) => {
    async function join(){
        let response = await axios.post('/api/v1/room/join',{ room_id:room._id },{ headers:{ authorization:User.access_token } });
        let payload = response.data;
        payload.callback = updateContent;
        return payload;
    }

    return (
        <div className="flex flex-col items-center w-1/2 my-2">
            <div className="flex flex-col w-full shadow-lg items-center rounded-lg">
                <div className="w-full">
                    <img className="object-cover w-full rounded-t-lg" src={room.profile_image != null ? room.profile_image : "/profile.jpeg"} />
                </div>
                <div className="font-mono font-semibold text-base sm:text-base my-1">{room.name}</div>
                <SubmitButton onClick={join} text={"Join"} className="bg-blue-200 text-blue-500 w-11/12 justify-center" wrapperClassName="my-4" />
            </div>
        </div>
    );
}