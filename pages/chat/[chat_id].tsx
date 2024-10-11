import ChatBox from '../../components/ChatBox';
import RecentChats from '../../components/RecentChats';

export default function Chat() {

  return (
    <div className='flex flex-row w-full flex-grow overflow-auto'>
      <RecentChats />
      <ChatBox />
    </div>
  )
}
