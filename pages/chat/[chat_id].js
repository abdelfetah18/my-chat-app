import { useEffect, useRef, useState } from 'react';
import { FaHome,FaCommentAlt,FaCog,FaBell,FaSearch,FaPaperPlane,FaPaperclip,FaSmile,FaTimes } from 'react-icons/fa';
import Navigation from '../../components/Navigation';
import { getData } from '../../database/client';
import axios from 'axios';
import ChatBox from '../../components/ChatBox';
import RecentChats from '../../components/RecentChats';

export async function getServerSideProps({ req,params }) {
    var { chat_id } = params;
    var user_info = req.decoded_jwt;
    var user = await getData('*[_type=="users" && _id==$user_id][0]{ "user_id":_id,username,"profile_image":profile_image.asset->url,"cover_image":cover_image.asset->url,bio }',{ user_id:user_info.user_id });
    var chats = await getData('*[_type=="chats" && count(*[_type=="messages" && @.chat._ref == ^._id]) > 0 && state=="accept" && (user._ref == $user_id || inviter._ref == $user_id)]{_id,"inviter":*[_type=="users" && @._id == ^.inviter._ref][0]{ username,"profile_image":profile_image.asset->url,"cover_image":cover_image.asset->url,bio },"user":*[_type=="users" && @._id == ^.user._ref][0]{ username,"profile_image":profile_image.asset->url,"cover_image":cover_image.asset->url,bio },"message":*[_type=="messages" && @.chat._ref == ^._id] | order(@._createdAt desc)[0] } | order(@.message._createdAt desc)',{ user_id:user_info.user_id });
    var chat = await getData('*[_type=="chats" && state=="accept" && _id == $chat_id]{_id,"inviter":*[_type=="users" && @._id == ^.inviter._ref][0]{ _id,username,"profile_image":profile_image.asset->url,"cover_image":cover_image.asset->url,bio },"user":*[_type=="users" && @._id == ^.user._ref][0]{ _id,username,"profile_image":profile_image.asset->url,"cover_image":cover_image.asset->url,bio },"messages":*[_type=="messages" && @.chat._ref == $chat_id] | order(@._createdAt asc)}[0]',{ chat_id });

    return {
        props: {
            chats,user,chat
        }
    }
}

export default function Chat({ chats,user,chat }) {
  var [User,setUser] = useState(user);
  var [messages,setMessages] = useState(chat.messages);
  var [my_chats,setMyChats] = useState(chats);
  var [images,setImages] = useState([]);
  var messages_box = useRef();
  var upload_image = useRef();

  useEffect(() => {
      var access_token = localStorage.getItem('access_token');
      var ws = new WebSocket(process.env.NODE_ENV != 'development' ? 'wss://my-chat-app.onrender.com'+'/?type=chat&access_token='+access_token : 'ws://'+location.host.replace('3000','4000')+'/?type=chat&access_token='+access_token);

      ws.emit = (eventName,payload) => {
        var data = JSON.stringify({ eventName,payload });
        ws.send(data);
      }

      ws.onopen = (ev) => {

      }

      ws.onmessage = (evt) => {
        var { eventName,payload } = JSON.parse(evt.data);
        console.log({ eventName,payload })
        ws.dispatchEvent(new CustomEvent(eventName,{ detail:payload }))
      }

      ws.addEventListener('msg',({ detail:payload }) => {
        if(payload.chat._ref === chat._id){
          setMessages(cur => [...cur,payload]);
        }
      });

      setUser(state => { return { ...state,access_token,ws } });
  },[]);
  
    if(chat != null){
      return (
        <div className='flex flex-row background h-screen w-screen'>
          <Navigation page={'/chat'} />
          <div className='lg:w-5/6 md:w-11/12 w-full bg-[#f1f5fe] rounded-l-3xl flex flex-col px-10 py-4 h-full'>
            <div className='w-full flex flex-row justify-end items-center px-4 py-2'>
              <div className='font-mono text-[#9199a8] mx-1 text-sm'>state:Sale</div>
              <FaBell className='font-mono text-[#ccd8e8] mx-1 text-base' />
            </div>
            <div className='w-full text-start font-mono font-bold text-2xl px-4 py-2 text-[#02166c]'>Chat</div>
            <div className='flex flex-row w-full h-full overflow-hidden'>
              <RecentChats User={User} my_chats={my_chats} setMyChats={setMyChats}/>
              <ChatBox User={User} chat={chat} setMyChats={setMyChats} messages={messages} setMessages={setMessages} />
            </div>
          </div>
        </div>
        )
    }else{
      return(
        <div>Chat_id Not Found!</div>
      )
    }
}
