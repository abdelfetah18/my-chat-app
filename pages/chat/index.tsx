import { ReactElement } from 'react';
import ChatLayout from '../../components/ChatLayout';

export default function Chat() {
  return (
    <div className='w-2/3 m-2 flex flex-col items-center justify-center'>
      <div className='text-gray-500'>{"Please choose a chat to view its details"}</div>
    </div>
  )
}

Chat.getLayout = function getLayout(page: ReactElement) {
  return (
    <ChatLayout>
      {page}
    </ChatLayout>
  )
}