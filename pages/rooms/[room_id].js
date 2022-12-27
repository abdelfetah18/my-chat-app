import { useEffect, useRef, useState } from 'react';
import { FaHome,FaCommentAlt,FaCog,FaBell,FaSearch,FaPaperPlane,FaPaperclip,FaSmile,FaTimes } from 'react-icons/fa';
import Navigation from '../../components/Navigation';
import { getData } from '../../database/client';
import axios from 'axios';
import RoomChatBox from '../../components/RoomChatBox';
import RecentRooms from '../../components/RecentRooms';

export async function getServerSideProps({ req,params }) {
    var { room_id } = params;
    var user_info = req.decoded_jwt;
    var rooms = await getData('*[_type=="room_members" && state=="accept" && member._ref==$user_id]{"room":*[_type=="rooms" && @._id == ^.room._ref][0]{_id,name,bio,"profile_image":profile_image.asset->url,"cover_image":cover_image.asset->url},"message":*[_type=="room_messages" && @.room._ref==^.room._ref] | order(@._createdAt desc)[0],} | order(@.message._createdAt desc)',{ user_id:user_info.user_id });
    var room = await getData('*[_type=="rooms" && _id==$room_id]{_id,name,bio,"profile_image":profile_image.asset->url,"cover_image":cover_image.asset->url, "is_admin": admin._ref == $user_id,"messages":*[_type=="room_messages" && @.room._ref == ^._id] | order(@._createdAt asc)}[0]',{ room_id, user_id: user_info.user_id });
    var room_requests = await getData('*[_type=="room_members" && member._ref==$user_id && room._ref==$room_id && role=="admin"][0]{"member_requests":*[_type=="room_members" && ^.room._ref==@.room._ref && @.state=="request"]{ _id,"user":*[_type=="users" && @._id==^.member._ref]{_id,username,bio,"profile_image":profile_image.asset->url,"cover_image":cover_image.asset->url}[0],state}}',{ room_id,user_id:user_info.user_id });

    
    return {
        props: {
            rooms,user:user_info,room,room_requests
        }
    }
}

export default function Room({ rooms,user,room,room_requests }) {
  var [User,setUser] = useState(user);
  var [messages,setMessages] = useState(room.messages);
  var [my_rooms,setMyRooms] = useState(rooms);
  
  useEffect(() => {
      var access_token = localStorage.getItem('access_token');
      var ws = new WebSocket(process.env.NODE_ENV ? 'wss://my-chat-app.onrender.com'+'/?room_id='+room._id+'&type=room&access_token='+access_token : 'ws://'+location.host.replace('3000','4000')+'/?room_id='+room._id+'&type=room&access_token='+access_token);

      ws.emit = (eventName,payload) => {
        var data = JSON.stringify({ eventName,payload });
        ws.send(data);
      }

      ws.onopen = (ev) => {

      }

      ws.onmessage = (evt) => {
        var { eventName,payload } = JSON.parse(evt.data);
        ws.dispatchEvent(new CustomEvent(eventName,{ detail:payload }))
      }

      ws.addEventListener('room-msg',({ detail:payload }) => {
        if(payload.room._ref === room._id){
          setMessages(cur => [...cur,payload]);
        }
      });

      setUser(state => { return { ...state,access_token,ws } });
  },[]);
  
  if(room != null){
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
            <RecentRooms User={User} my_rooms={my_rooms} room_requests={room_requests} setMyRooms={setMyRooms} />
            <RoomChatBox User={User} room={room} setMyRooms={setMyRooms} messages={messages} setMessages={setMessages} />
          </div>
        </div>
      </div>
      )
  }else{
    return(
      <div>Room_id Not Found!</div>
    )
  }
}
