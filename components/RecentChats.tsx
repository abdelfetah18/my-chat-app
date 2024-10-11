import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import useChats from '../libs/hooks/useChats';
import ChatCard from './ChatCard';

export default function RecentChats() {
  const { chats, search } = useChats();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (query.length > 0) {
      search(query);
    }
  }, [query]);


  return (
    <div className={`bg-white rounded-3xl flex flex-col w-1/3 m-2 shadow-xl items-center py-6`} >
      <div className='text-xl font-semibold mb-2 w-11/12'>Chats</div>
      <div className='my-2 flex flex-row w-11/12 bg-gray-100 items-center px-4 py-2 rounded-full'>
        <input className='w-11/12 text-sm bg-transparent px-4' value={query} onChange={(evt) => setQuery(evt.target.value)} placeholder='Search' />
        <FaSearch className='w-1/12 text-[#c8cee5]' />
      </div>
      <div className='w-full flex flex-col'>
        {
          chats.map((chat, index) => <ChatCard key={index} chat={chat} />)
        }
      </div>
    </div>
  )
}