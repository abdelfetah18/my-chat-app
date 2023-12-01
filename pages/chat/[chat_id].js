import { useEffect, useRef, useState } from 'react';
import { FaHome,FaCommentAlt,FaCog,FaBell,FaSearch,FaPaperPlane,FaPaperclip,FaSmile,FaTimes } from 'react-icons/fa';
import Navigation from '../../components/Navigation';
import { getChat, getRecentChats, getUser } from '../../database/client';
import axios from 'axios';
import ChatBox from '../../components/ChatBox';
import RecentChats from '../../components/RecentChats';

export async function getServerSideProps({ req,params }) {
  let { chat_id } = params;
  let user_info = req.decoded_jwt;
  let user = await getUser(user_info.user_id);
  let chats = await getRecentChats(user_info.user_id);
  let chat = await getChat(user_info.user_id, chat_id);

  return { props: { chats, user, chat } }
}

export default function Chat({ chats, user, chat }) {
  let [User,setUser] = useState(user);
  let [messages,setMessages] = useState(chat.messages);
  let [my_chats,setMyChats] = useState(chats);
  let [images,setImages] = useState([]);
  let messages_box = useRef();
  let upload_image = useRef();

  useEffect(() => {
      let access_token = localStorage.getItem('access_token');
      let ws = new WebSocket((process.env.NODE_ENV != 'development' ? 'wss://my-chat-app.onrender.com' : 'ws://'+location.host.replace('3000','4000'))+'/?chat_id='+chat.chat_id+'&access_token='+access_token);

      ws.emit = (eventName,payload) => {
        let data = JSON.stringify({ eventName,payload });
        ws.send(data);
      }

      ws.onopen = (ev) => {

      }

      ws.onmessage = (evt) => {
        let { eventName,payload } = JSON.parse(evt.data);
        ws.dispatchEvent(new CustomEvent(eventName,{ detail:payload }))
      }

      ws.addEventListener('msg',({ detail:payload }) => {
        if(payload.chat._ref === chat.chat_id){
          setMessages(cur => [...cur,payload]);
        }
      });

      setUser(state => { return { ...state,access_token, ws } });
  },[]);
  
    if(chat != null){
      return (
        <div className='flex flex-row background h-screen w-screen'>
          <Navigation page={'/chat'} />
          <div className='lg:w-5/6 md:w-11/12 w-full bg-[#f1f5fe] md:rounded-l-3xl flex flex-col px-10 py-4 h-full'>
            <div className='w-full flex flex-row justify-end items-center px-4 py-2'>
              <FaBell className='font-mono text-[#ccd8e8] mx-1 text-base' />
              <div className='font-mono text-[#9199a8] mx-1 text-sm'>Notifications</div>
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
