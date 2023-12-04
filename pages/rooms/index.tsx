import { useEffect, useRef, useState } from 'react';
import { FaHome,FaCommentAlt,FaCog,FaBell,FaSearch,FaPaperPlane,FaPaperclip,FaSmile } from 'react-icons/fa';
import Navigation from '../../components/Navigation';
import { getRooms, getUser } from '../../database/client';
import axios from 'axios';
import RecentRooms from '../../components/RecentRooms';
import RoomChatBox from '../../components/RoomChatBox';


export async function getServerSideProps({ req,params }) {
    let user_info = req.userSession;
    let user = await getUser(user_info.user_id);
    let rooms = await getRooms(user_info.user_id);

    return {
        props: {
            rooms,user
        }
    }
}

export default function Room({ rooms, user }) {
  let [User,setUser] = useState(user);
  let [messages,setMessages] = useState([]);
  let [my_rooms,setMyRooms] = useState(rooms);

  const room = {
    name: user.username,
    ...user,
    admin: { _id: "" },
    total_members: 0,
    is_public: true
  };

  useEffect(() => {
    let access_token = localStorage.getItem('access_token');
    setUser(state => { return { ...state,access_token } });
  },[]);

  return (
    <div className='flex flex-col md:flex-row background h-screen w-screen'>
      <Navigation page={'/rooms'} />
      <div className='lg:w-5/6 md:w-11/12 w-full bg-[#f1f5fe] md:rounded-l-3xl flex flex-col items-center py-4 h-full'>
        <div className='w-11/12 flex flex-row justify-end items-center py-2'>
          <FaBell className='font-mono text-[#ccd8e8] mx-1 text-base' />
          <div className='font-mono text-[#9199a8] mx-1 text-sm'>Notifications</div>
        </div>
        <div className='w-11/12 text-start font-mono font-bold text-2xl px-4 py-2 text-[#02166c]'>Room</div>
        <div className='flex flex-row w-11/12 h-full overflow-hidden'>
          <RecentRooms User={User} my_rooms={my_rooms} room_requests={{ member_requests:[] }} setMyRooms={setMyRooms} />
          <RoomChatBox room={room} User={User} />
        </div>
      </div>
    </div>
  )
}
