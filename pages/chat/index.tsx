import ChatBox from '../../components/ChatBox';
import RecentChats from '../../components/RecentChats';

export default function Chat() {
  return (
    <div className='flex sm:flex-row flex-col w-full flex-grow'>
      <RecentChats />
      <ChatBox />
    </div>
  )
}
