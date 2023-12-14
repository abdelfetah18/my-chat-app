import RecentRooms from '../../components/RecentRooms';
import RoomChatBox from '../../components/RoomChatBox';

export default function Room() {
  return (
    <div className='flex flex-row w-11/12 h-full overflow-hidden'>
      <RecentRooms />
      <RoomChatBox />
    </div>
  )
}
