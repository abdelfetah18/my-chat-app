import useExploreRooms from "../../libs/hooks/useExploreRooms";
import Room from "../../components/Room";
import { SubmitButtonResult } from "../../components/SubmitButton";

export default function Explore(){
    const { rooms, joinRoom } = useExploreRooms();

    if(rooms.length == 0)
        return <></>

    return(
        <div className='flex flex-col w-11/12 overflow-auto'>
            <div className="w-full sm:w-11/12 flex flex-col my-2 sm:my-0">
                <div className="font-mono text-sm sm:text-lg font-semibold text-purple-900 uppercase">Rooms you may like to join:</div>
                <div className="w-full flex flex-col">
                    <div className="flex flex-row w-full flex-wrap my-4">
                        {
                            rooms.map((room, index) => {
                                async function onClick() : Promise<SubmitButtonResult> {
                                    await joinRoom(room._id);
                                    return { status: 'success' };
                                }

                                return (
                                    <Room key={index} room={room} onClick={onClick} />
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}