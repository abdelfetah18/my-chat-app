import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import useChats from '../libs/hooks/useChats';
import ChatCard from './ChatCard';
import { useRouter } from 'next/router';

export default function RecentChats() {
  const { chats, search } = useChats();
  const [show, setShow] = useState(true);
  let [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (router.query.chat_id) {
      setShow(false);
    }
  }, [router.query.chat_id]);

  useEffect(() => {
    if (query.length > 0) {
      search(query);
    }
  }, [query]);


  return (
    <div className={`md:w-1/6 sm:flex w-full flex flex-col lg:w-2/6 sm:ml-8 my-2 sm:my-0 items-center ${show ? "flex" : "hidden"}`} >
      <div className='my-2 flex flex-row w-11/12 bg-[#fafbff] items-center px-4 py-2 rounded-xl'>
        <input className='w-11/12 font-mono text-xl bg-transparent px-4' value={query} onChange={(evt) => setQuery(evt.target.value)} placeholder='Search' />
        <FaSearch className='w-1/12 text-[#c8cee5]' />
      </div>
      {
        chats.map((chat, index) => <ChatCard key={index} chat={chat} />)
      }
    </div>
  )
}