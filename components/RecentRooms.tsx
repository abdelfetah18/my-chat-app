import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import useRooms from '../libs/hooks/useRooms';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function RecentRooms() {
    const { rooms } = useRooms();
    const [query, setQuery] = useState("");

    return (
        <div className={`bg-white rounded-3xl flex flex-col w-1/3 m-2 shadow-xl items-center py-6`}>
            <div className='flex mb-4 flex-row w-11/12 bg-gray-100 items-center px-4 py-2 rounded-xl'>
                <input className='w-11/12 text-base bg-transparent px-4' value={query} onChange={(evt) => setQuery(evt.target.value)} placeholder='Search' />
                <FaSearch className='w-1/12 text-[#c8cee5]' />
            </div>
            <div className='w-11/12 flex flex-col gap-1 overflow-auto'>
                {
                    rooms.map((room, index) => <Room key={index} room={room} />)
                }
            </div>
        </div>
    )
}

const Room = ({ room }) => {
    const router = useRouter();

    const maxBioSize = 40;
    const roomBio = room.bio.length > maxBioSize ? `${room.bio.slice(0, maxBioSize)}...` : room.bio;

    return (
        <Link href={`/rooms/${room._id}`} className={'w-full gap-2 hover:bg-gray-100 cursor-pointer flex flex-row items-center px-4 py-2 rounded-xl ' + (router.query.room_id == room._id ? "bg-gray-100" : "")}>
            <div className='w-14 h-14'>
                <img alt="profile_image" className='object-cover w-14 h-14 rounded-full border-white border-[3px]' src={(room.profile_image?.url || '/profile.png')} />
            </div>
            <div className='flex flex-col flex-grow'>
                <div className='flex flex-row w-full'>
                    <div className='flex flex-col w-11/12'>
                        <div className='text-base font-bold text-black'>{room.name}</div>
                        <div className='text-xs font-medium text-gray-400 text-ellipsis w-full'>{roomBio}</div>
                    </div>
                    {/* TODO: unread messages counter, not available because unread state is not implemented! */}
                    <div className='hidden items-center justify-center w-1/12'>
                        <div className='bg-[#fd476f] rounded-full h-4 w-4 text-center text-xs text-white'>5</div>
                    </div>
                </div>
            </div>
        </Link>
    )
}