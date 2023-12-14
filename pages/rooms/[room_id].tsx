import RoomChatBox from '../../components/RoomChatBox';
import RecentRooms from '../../components/RecentRooms';

export default function Room() {
  return (
    <div className='flex flex-row w-11/12 h-full overflow-hidden'>
      <RecentRooms />
      <RoomChatBox />
    </div>
  )
}
