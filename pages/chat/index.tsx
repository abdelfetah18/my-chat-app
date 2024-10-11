import RecentChats from '../../components/RecentChats';

export default function Chat() {
  return (
    <div className='flex flex-row w-full flex-grow'>
      <RecentChats />
      <div className='flex-grow h-full flex flex-col items-center justify-center'>
        <div className='text-gray-500'>{"Please choose a chat to view its details"}</div>
      </div>
    </div>
  )
}
