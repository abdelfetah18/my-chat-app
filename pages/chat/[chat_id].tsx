import { ReactElement } from 'react';
import ChatBox from '../../components/ChatBox';
import ChatLayout from '../../components/ChatLayout';

export default function Chat() {
  return (
    <ChatBox />
  )
}

Chat.getLayout = function getLayout(page: ReactElement) {
  return (
    <ChatLayout>
      {page}
    </ChatLayout>
  )
}