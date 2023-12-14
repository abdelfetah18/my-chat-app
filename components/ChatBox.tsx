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
    <div className={`md:w-5/6 w-full sm:flex flex-col lg:w-4/6 items-center sm:h-auto overflow-auto sm:static flex-grow ${chat._id ? "flex fixed h-full top-0 left-0 z-20" : "hidden"}`}>
      {isLoading && <Loading />}
      <div className='sm:w-11/12 w-full py-2 px-4 flex flex-row bg-[#fafbff] rounded-xl'>
        <div className='md:w-2/12 lg:w-1/12'>
          <img alt="profile_image" className='object-cover w-14 h-14 rounded-full' src={chat.target.profile_image ? chat.target.profile_image.url : "/profile.png"} />
        </div>
        <div className='flex flex-col w-11/12 px-2'>
          <div className='font-mono font-semibold text-lg text-[#000049]'>{chat.target?.username || chat.target?.name}</div>
          <div className='font-mono text-sm text-[#acb2c8]'>{(chat.bio || 'Welcome to chat')}</div>
        </div>
      </div>
      <div className='sm:w-11/12 bg-gray-50 w-full sm:py-4 sm:px-4 flex flex-col rounded-xl sm:my-4 overflow-auto flex-grow'>
        <div ref={messages_box} className={'flex flex-col w-full overflow-auto sm:px-2 px-4 flex-grow'}>
          {
            chat.messages?.map((msg, i) => <Message key={i} msg={msg} />)
          }
        </div>
        {
          (images.length > 0) ? (
            <div className='flex flex-col w-full bg-[#7f82de] rounded-lg'>
              <div className='w-full flex items-end justify-end p-1 text-white'><FaTimes /></div>
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
        <div className='w-full bg-[#ffffff] rounded-xl px-4 py-2 flex flex-row shadow-xl items-center justify-between sm:my-0 my-2'>
          <input onChange={isValidChat ? uploadImage : null} ref={upload_image} type={"file"} hidden={true} />
          <input onKeyUp={(evt) => { if (evt.code === 'Enter') { if (isValidChat) { sendMsg() } } }} value={message_content} onChange={(e) => setMessageContent(e.target.value)} className='w-9/12 text-base font-mono px-4 py-2 bg-transparent' placeholder='type a message' />
          {/* <div className='w-1/12 relative'>
                  <FaSmile onClick={toggleEmojiPicker} className='cursor-pointer text-base font-mono text-[#a9bae8]' />
                  <motion.div animate={emojiPickerAnim} className='absolute hidden opacity-0 bottom-full right-full'>
                    <EmojiPicker onEmojiClick={(emoji,event) => setMessageContent(state => state+=emoji.emoji)} />
                  </motion.div>
                </div> */}
          <div className='w-2/12 flex flex-row items-center'>
            <FaPaperclip onClick={() => { if (isValidChat) { if (upload_image.current) { upload_image.current.click(); } } }} className='cursor-pointer w-1/2 text-base font-mono text-[#a9bae8]' />
            <FaPaperPlane onClick={isValidChat ? sendMsg : null} className='cursor-pointer w-1/2 text-base font-mono text-[#a9bae8]' />
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
          <div className='font-mono text-white text-sm bg-[#6b1aff] w-fit max-w-xl px-4 py-2 rounded-t-xl rounded-l-xl break-all'>{msg.message_content}</div>
          <div className='text-xs text-end text-[#c3c9d7] font-mono my-1' title={(new Date(msg._createdAt)).toLocaleString()}>{(new Date(msg._createdAt)).toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      )
    }

    if (msg.message_type === "image") {
      return (
        <div className='flex flex-col max-w-5/6 self-end'>
          <img alt="image" className='flex self-end shadow-xl rounded-lg border-2 w-1/3' src={msg.message_image.url} />
          <div className='text-xs text-end text-[#c3c9d7] font-mono my-1' title={(new Date(msg._createdAt)).toLocaleString()}>{(new Date(msg._createdAt)).toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' })}</div>
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
              <div ref={usernameRef} className='absolute top-11 bg-gray-300 rounded-lg px-2 hidden text-xs font-mono font-medium text-gray-400' >{msg.user.username}</div>
            </div>
            <div className='ml-2 flex flex-col'>
              <div className='font-mono text-[#8f96a9] text-sm bg-[#eef2fd] w-fit px-4 py-2 rounded-t-xl rounded-r-xl max-w-xl break-all'>{msg.message_content}</div>
              <div className='text-xs text-start text-[#c3c9d7] font-mono my-1' title={(new Date(msg._createdAt)).toLocaleString()}>{(new Date(msg._createdAt)).toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' })}</div>
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
              <div ref={usernameRef} className='absolute top-11 bg-gray-300 rounded-lg px-2 hidden text-xs font-mono font-medium text-gray-400' >{msg.user.username}</div>
            </div>
            <div className='ml-2 flex flex-col w-1/3'>
              <img alt="image" className='flex self-start shadow-xl rounded-lg border-2 w-full' src={msg.message_image.url} />
              <div className='text-xs text-start text-[#c3c9d7] font-mono my-1' title={(new Date(msg._createdAt)).toLocaleString()}>{(new Date(msg._createdAt)).toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>
        </div>
      )
    }
  }
}