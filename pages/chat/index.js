import { useEffect, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import Navigation from '../../components/Navigation';
import { getRecentChats, getUser } from '../../database/client';
import ChatBox from '../../components/ChatBox';
import RecentChats from '../../components/RecentChats';

export async function getServerSideProps({ req }) {
  let user_info = req.decoded_jwt;
  let user = await getUser(user_info.user_id);
  let chats = await getRecentChats(user_info.user_id);
  console.log({chats})
  return { props: { chats, user } }
}

export default function Chat({ chats, user }) {
  let [User,setUser] = useState(user);
  let [my_chats,setMyChats] = useState(chats);
  let [messages,setMessages] = useState([]);

  useEffect(() => {
      let access_token = localStorage.getItem('access_token');
      setUser(state => { return { ...state,access_token } });
  },[]);

  return (
    <div className='flex flex-col md:flex-row background h-screen w-screen'>
      <Navigation page={'/chat'} />
      <div className='lg:w-5/6 md:w-11/12 w-full bg-[#f1f5fe] md:rounded-l-3xl flex flex-col py-4 flex-grow'>
        <div className='w-11/12 flex flex-row justify-end items-center py-2'>
          <FaBell className='font-mono text-[#ccd8e8] mx-1 text-base' />
          <div className='font-mono text-[#9199a8] mx-1 text-sm'>Notifications</div>
        </div>
        <div className='w-full text-start font-mono font-bold text-2xl px-4 py-2 text-[#02166c]'>Chat</div>
        <div className='flex flex-row w-full flex-grow'>
          <RecentChats User={User} my_chats={my_chats} setMyChats={setMyChats} />
          <ChatBox User={User} chat={user} setMyChats={setMyChats} messages={messages} setMessages={setMessages}  />
        </div>
      </div>
    </div>
  )
}
