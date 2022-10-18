import { useEffect, useRef, useState } from 'react';
import { FaHome,FaCommentAlt,FaCog,FaBell,FaSearch,FaPaperPlane,FaPaperclip,FaSmile } from 'react-icons/fa';
import Navigation from '../../components/Navigation';
import { getData } from '../../database/client';
import axios from 'axios';
import RecentRooms from '../../components/RecentRooms';
import RoomChatBox from '../../components/RoomChatBox';


export async function getServerSideProps({ req,params }) {
    var user_info = req.decoded_jwt;
    var user = await getData('*[_type=="users" && _id==$user_id][0]{ "user_id":_id,username,"profile_image":profile_image.asset->url,"cover_image":cover_image.asset->url,bio }',{ user_id:user_info.user_id });
    var rooms = await getData('*[_type=="room_members" && state=="accept" && member._ref==$user_id]{"room":*[_type=="rooms" && @._id == ^.room._ref][0]{_id,name,bio,"profile_image":profile_image.asset->url,"cover_image":cover_image.asset->url},"message":*[_type=="room_messages" && @.room._ref==^.room._ref] | order(@._createdAt desc)[0],} | order(@.message._createdAt desc)',{ user_id:user_info.user_id });

    return {
        props: {
            rooms,user
        }
    }
}

export default function Room({ rooms,user }) {
  var [User,setUser] = useState(user);
  var [messages,setMessages] = useState([]);
  var [my_rooms,setMyRooms] = useState(rooms);


  useEffect(() => {
    var access_token = localStorage.getItem('access_token');
    setUser(state => { return { ...state,access_token } });
  },[]);

  return (
    <div className='flex flex-row background h-screen w-screen'>
      <Navigation page={'/rooms'} />
      <div className='lg:w-5/6 md:w-11/12 w-full bg-[#f1f5fe] rounded-l-3xl flex flex-col px-10 py-4 h-full'>
        <div className='w-full flex flex-row justify-end items-center px-4 py-2'>
          <div className='font-mono text-[#9199a8] mx-1 text-sm'>state:Sale</div>
          <FaBell className='font-mono text-[#ccd8e8] mx-1 text-base' />
        </div>
        <div className='w-full text-start font-mono font-bold text-2xl px-4 py-2 text-[#02166c]'>Room</div>
        <div className='flex flex-row w-full h-full overflow-hidden'>
          <RecentRooms User={User} my_rooms={my_rooms} room_requests={{ member_requests:[] }} setMyRooms={setMyRooms} />
          <RoomChatBox User={User} messages={messages} setMessages={setMessages} setMyRooms={setMyRooms} />
        </div>
      </div>
    </div>
  )
}
