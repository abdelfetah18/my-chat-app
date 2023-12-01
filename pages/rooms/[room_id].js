import { useEffect, useRef, useState } from 'react';
import { FaHome,FaCommentAlt,FaCog,FaBell,FaSearch,FaPaperPlane,FaPaperclip,FaSmile,FaTimes } from 'react-icons/fa';
import Navigation from '../../components/Navigation';
import { getRoom, getRooms, getUser } from '../../database/client';
import RoomChatBox from '../../components/RoomChatBox';
import RecentRooms from '../../components/RecentRooms';

export async function getServerSideProps({ req,params }) {
    let { room_id } = params;
    let user_info = req.decoded_jwt;
    let user = await getUser(user_info.user_id);
    let rooms = await getRooms(user_info.user_id);
    let room = await getRoom(room_id);
    
    return {
      props: { rooms, user, room }
    }
}

export default function Room({ rooms, user, room }) {
  let [User,setUser] = useState(user);
  let [my_rooms,setMyRooms] = useState(rooms);


  useEffect(() => {
    let access_token = localStorage.getItem('access_token');
    setUser(state => { return { ...state,access_token } });
  },[]);

  return (
    <div className='flex flex-row background h-screen w-screen'>
      <Navigation page={'/rooms'} />
      <div className='lg:w-5/6 md:w-11/12 w-full bg-[#f1f5fe] md:rounded-l-3xl flex flex-col px-10 py-4 h-full'>
        <div className='w-full flex flex-row justify-end items-center px-4 py-2'>
          <FaBell className='font-mono text-[#ccd8e8] mx-1 text-base' />
          <div className='font-mono text-[#9199a8] mx-1 text-sm'>Notifications</div>
        </div>
        <div className='w-full text-start font-mono font-bold text-2xl px-4 py-2 text-[#02166c]'>Room</div>
        <div className='flex flex-row w-full h-full overflow-hidden'>
          <RecentRooms User={User} my_rooms={my_rooms} room_requests={{ member_requests:[] }} setMyRooms={setMyRooms} />
          <RoomChatBox room={room} User={User} />
        </div>
      </div>
    </div>
  )
}
