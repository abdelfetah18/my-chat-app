import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import useRooms from '../libs/hooks/useRooms';
import { useRouter } from 'next/router';

export default function RecentRooms(){
    const { rooms } = useRooms();
    const [show, setShow] = useState(true);
    let [query, setQuery] = useState("");
    const router = useRouter();
  
    useEffect(() => {
      if (router.query.room_id) {
        setShow(false);
      }
    }, [router.query.room_id]);

    return(
        <div className={`md:w-1/6 lg:flex md:flex flex-col lg:w-2/6 ${show ? "flex" : "hidden"}`}>
            <div className='md:hidden lg:flex my-2 flex flex-row sm:w-11/12 w-full bg-[#fafbff] items-center px-4 py-2 rounded-xl'>
                <input className='w-11/12 font-mono text-xl bg-transparent px-4' value={query} onChange={(evt) => setQuery(evt.target.value)} placeholder='Search' />
                <FaSearch className='w-1/12 text-[#c8cee5]' />
            </div>
            <div className='w-full sm:w-11/12 flex flex-col overflow-auto'>
                {
                    rooms.map((room, index) => <Room key={index} room={room} />)
                }
            </div>
        </div>
    )
}

const Room = ({ room }) => {
    const router = useRouter();

    return (
        <a href={`/rooms/${room._id}`} className={'md:w-fit hover:shadow-xl cursor-pointer my-2 flex flex-row lg:w-full bg-[#fafbff] items-center px-4 py-2 rounded-xl'+(router.query.room_id == room._id ? " bg-gray-300/30" : "")}>
            <div className='w-14'>
                <img alt="profile_image" className='object-cover w-14 h-14 rounded-full border-white border-[3px]' src={(room.profile_image?.url || '/profile.png')} />
            </div>
            <div className='lg:flex flex-col lg:flex-grow md:hidden'>
                {
                    // <div className='w-full text-end font-mono text-xs font-semibold text-[#a2aac1]'>{room.bio}</div>
                }
                <div className='flex flex-row w-full'>
                    <div className='flex flex-col w-11/12 px-2 '>
                        <div className='font-mono text-base font-bold text-[#020762]'>{room.name}</div>
                        <div className='font-mono text-xs font-medium text-[#b7bfcc] text-ellipsis w-full'>{room.bio}</div>
                    </div>
                        {/* TODO: unread messages counter, not available because unread state is not implemented! */}
                    <div className='hidden items-center justify-center w-1/12'>
                        <div className='font-mono bg-[#fd476f] rounded-full h-4 w-4 text-center text-xs text-white'>5</div>
                    </div>
                </div>
            </div>
        </a>
    )
}