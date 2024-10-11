import useExploreRooms from "../../libs/hooks/useExploreRooms";
import Room from "../../components/Room";
import { SubmitButtonResult } from "../../components/SubmitButton";

export default function Explore(){
    const { rooms, joinRoom } = useExploreRooms();

    if(rooms.length == 0)
        return <></>

    return(
        <div className='flex flex-col items-center w-full overflow-auto'>
            <div className="w-11/12 flex flex-col my-16">
                <div className="text-xl text-primaryColor font-bold mb-4">Explore</div>
                <div className="w-full flex flex-col">
                    <div className="grid grid-cols-5 gap-x-4 gap-y-10 w-full flex-wrap">
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