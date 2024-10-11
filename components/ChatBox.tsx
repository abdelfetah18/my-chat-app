import { FaPaperPlane, FaPaperclip, FaTimes } from 'react-icons/fa';
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from 'next/router';
import useChat from '../libs/hooks/useChat';
import UserSessionContext from '../libs/contexts/UserSessionContext';
import { UserSession } from '../domain/UsersSessions';
import Loading from './Loading';
// import EmojiPicker from 'emoji-picker-react';

export default function ChatBox() {
  const router = useRouter();
  const userSession = useContext(UserSessionContext);
  const { chat, sendImage, sendMessage } = useChat(router.query.chat_id as string);

  let [message_content, setMessageContent] = useState('');
  let [isValidChat, setValidChat] = useState(chat._id ? true : false);
  let [images, setImages] = useState<File[]>([]);
  let messages_box = useRef<HTMLDivElement>(null);
  let upload_image = useRef<HTMLInputElement>(null);
  // let emojiPickerAnim = useAnimation();
  // let [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setValidChat(chat._id ? true : false);
  }, [chat]);

  useEffect(() => {
    messages_box.current.scrollTo({
      top: messages_box.current.scrollHeight,
      behavior: 'smooth'
    });
    messages_box.current.focus();
    // Update RecentChats list
  }, [chat.messages]);



  async function sendMsg() {
    setIsLoading(true);
    for (let i = 0; i < images.length; i++) {
      let message = await sendImage(images[i]);
      sendMessage(message);
    }
    setImages([]);
    setIsLoading(false);

    if (message_content.length > 0) {
      sendMessage({ chat, message_content, message_type: "text", user: { _type: "reference", _ref: userSession.user_id } });
      setMessageContent('');
    }

  }

  function uploadImage(evt: ChangeEvent<HTMLInputElement>) {
    setImages(state => [...state, evt.target.files[0]]);
  }

  // function toggleEmojiPicker() {
  //   if (emojiPickerOpen) {
  //     emojiPickerAnim.start({
  //       opacity: 0,
  //       transition: {
  //         duration: 0.5
  //       }
  //     }).then(() => {
  //       emojiPickerAnim.set({ display: "none" });
  //       setEmojiPickerOpen(false);
  //     });
  //   } else {
  //     emojiPickerAnim.start({
  //       display: "block",
  //       opacity: 1,
  //       transition: {
  //         duration: 0.5
  //       }
  //     }).then(() => {
  //       setEmojiPickerOpen(true);
  //     });
  //   }
  // }

  const getImageUrl = (file: File) => {
    return URL.createObjectURL(file);
  }

  return (
    <div className={"w-2/3 bg-white m-2 rounded-3xl shadow-xl flex flex-col items-center"}>
      {isLoading && <Loading />}
      <div className='w-full py-4 px-6 flex flex-row items-center gap-2'>
        <div className='w-10'>
          <img alt="profile_image" className='object-cover w-10 h-10 rounded-full' src={chat.target.profile_image ? chat.target.profile_image.url : "/profile.png"} />
        </div>
        <div className='flex flex-col flex-grow'>
          <div className='text-base text-black font-medium'>{chat.target?.username || chat.target?.name}</div>
          <div className='text-xs text-gray-400'>{(chat.bio || 'Welcome to chat')}</div>
        </div>
      </div>
      <div className='bg-gray-50 w-full py-4 flex flex-col rounded-xl my-4 overflow-auto flex-grow'>
        <div ref={messages_box} className={'flex flex-col w-full overflow-auto px-8 flex-grow'}>
          {
            chat.messages?.map((msg, i) => <Message key={i} msg={msg} />)
          }
        </div>
        {
          (images.length > 0) ? (
            <div className='flex flex-col w-full border rounded-xl'>
              <div className='w-full flex items-end justify-end py-2 px-4'>
                <div className='flex items-center justify-center text-sm active:scale-105 duration-300 select-none cursor-pointer'>
                  <FaTimes />
                  <span>Cancel</span>
                </div>
              </div>
              <div className='w-full flex flex-row overflow-auto rounded-lg p-2'>
                {
                  images.map((img, index) => {
                    return (
                      <div key={index} className='flex flex-col shadow-lg rounded-lg w-28 mx-2'>
                        <img alt="image" className="rounded-lg w-28" src={getImageUrl(img)} />
                      </div>
                    )
                  })
                }
              </div>
            </div>
          ) : ('')
        }
        <div className='w-full px-6 flex flex-row items-center justify-between gap-4 mt-2'>
          <input onChange={isValidChat ? uploadImage : null} ref={upload_image} type={"file"} hidden={true} />
          <div className='bg-gray-100 rounded-full flex items-center flex-grow'>
            <input onKeyUp={(evt) => { if (evt.code === 'Enter') { if (isValidChat) { sendMsg() } } }} value={message_content} onChange={(e) => setMessageContent(e.target.value)} className='flex-grow text-base bg-transparent px-6 py-2' placeholder='Type a message' />
            <div className='px-4'>
              <FaPaperclip onClick={() => { if (isValidChat) { if (upload_image.current) { upload_image.current.click(); } } }} className='cursor-pointer text-base  text-primaryColor' />
            </div>
          </div>
          <div>
            <FaPaperPlane onClick={isValidChat ? sendMsg : null} className='cursor-pointer text-xl text-primaryColor' />
          </div>
        </div>
      </div>
    </div>
  )
}

const Message = ({ msg }) => {
  const userSession = useContext<UserSession>(UserSessionContext);
  const usernameRef = useRef<HTMLDivElement>(null);

  function onHoverStart() {
    if (usernameRef.current) {
      usernameRef.current.style.display = "block";
    }
  }

  function onHoverEnd() {
    if (usernameRef.current) {
      usernameRef.current.style.display = "none";
    }
  }

  if (msg.user._id === userSession.user_id) {
    if (msg.message_type === "text") {
      return (
        <div className='flex flex-col max-w-5/6 self-end'>
          <div className=' text-white text-sm bg-[#6b1aff] w-fit max-w-xl px-4 py-2 rounded-t-xl rounded-l-xl break-all'>{msg.message_content}</div>
          <div className='text-xs text-end text-[#c3c9d7]  my-1' title={(new Date(msg._createdAt)).toLocaleString()}>{(new Date(msg._createdAt)).toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      )
    }

    if (msg.message_type === "image") {
      return (
        <div className='flex flex-col max-w-5/6 self-end'>
          <img alt="image" className='flex self-end shadow-xl rounded-lg border-2 w-1/3' src={msg.message_image.url} />
          <div className='text-xs text-end text-[#c3c9d7]  my-1' title={(new Date(msg._createdAt)).toLocaleString()}>{(new Date(msg._createdAt)).toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      )
    }
  } else {
    if (msg.message_type === "text") {
      return (
        <div className='flex flex-col max-w-5/6 self-start'>
          <div className='w-full flex flex-row'>
            <div className='relative'>
              <img alt="image" onMouseEnter={onHoverStart} onMouseLeave={onHoverEnd} className='h-10 w-10 rounded-full cursor-pointer' src={msg.user.profile_image?.url || "/profile.png"} />
              <div ref={usernameRef} className='absolute top-11 bg-gray-300 rounded-lg px-2 hidden text-xs  font-medium text-gray-400' >{msg.user.username}</div>
            </div>
            <div className='ml-2 flex flex-col'>
              <div className=' text-[#8f96a9] text-sm bg-[#eef2fd] w-fit px-4 py-2 rounded-t-xl rounded-r-xl max-w-xl break-all'>{msg.message_content}</div>
              <div className='text-xs text-start text-[#c3c9d7]  my-1' title={(new Date(msg._createdAt)).toLocaleString()}>{(new Date(msg._createdAt)).toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>
        </div>
      )
    }

    if (msg.message_type === "image") {
      return (
        <div className='flex flex-col max-w-5/6 self-start'>
          <div className='w-full flex flex-row'>
            <div className='relative'>
              <img alt="image" onMouseEnter={onHoverStart} onMouseLeave={onHoverEnd} className='h-10 w-10 rounded-full cursor-pointer' src={msg.user.profile_image?.url || "/profile.png"} />
              <div ref={usernameRef} className='absolute top-11 bg-gray-300 rounded-lg px-2 hidden text-xs  font-medium text-gray-400' >{msg.user.username}</div>
            </div>
            <div className='ml-2 flex flex-col w-1/3'>
              <img alt="image" className='flex self-start shadow-xl rounded-lg border-2 w-full' src={msg.message_image.url} />
              <div className='text-xs text-start text-[#c3c9d7]  my-1' title={(new Date(msg._createdAt)).toLocaleString()}>{(new Date(msg._createdAt)).toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>
        </div>
      )
    }
  }
}