import RecentRooms from '../../components/RecentRooms';

export default function Room() {
  return (
    <div className='flex flex-row w-full h-full overflow-hidden'>
      <RecentRooms />
      <div className='flex-grow h-full flex flex-col items-center justify-center'>
        <div className='text-gray-500'>{"Please choose a room to view its details"}</div>
      </div>
    </div>
  )
}
