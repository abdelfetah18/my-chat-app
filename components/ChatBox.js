import { FaHome,FaCommentAlt,FaCog,FaBell,FaSearch,FaPaperPlane,FaPaperclip,FaSmile,FaTimes } from 'react-icons/fa';
import { useEffect, useRef, useState } from "react";
import EmojiPicker from 'emoji-picker-react';
import { motion, useAnimation } from 'framer-motion';
import axios from 'axios';

export default function ChatBox({ User, chat, setMyChats, messages, setMessages }){
  let [message_content,setMessageContent] = useState('');
  let [isValidChat,setValidChat] = useState(chat.chat_id ? true : false);
  let [images,setImages] = useState([]);
  let messages_box = useRef();
  let upload_image = useRef();
  let emojiPickerAnim = useAnimation();
  let [emojiPickerOpen,setEmojiPickerOpen] = useState(false);

  useEffect(() => {
      messages_box.current.scrollTo({
        top: messages_box.current.scrollHeight,
        behavior: 'smooth'
      });
      updateChats();
  },[messages]);
  
  function updateChats(){
    axios.get('/api/v1/user/chats',{
      headers:{
        authorization:User.access_token
      }
    }).then((response) => {
      if(response.data.status == 'success'){
        setMyChats(response.data.data);
      }
    });
  }

  function sendMsg(e){
    for(let i=0;i<images.length;i++){
      let image_payload = { chat_id: chat.chat_id, message_content:images[i].url, message_type:'image' };
      setMessages(cur => [...cur,{ chat:{ _id: chat.chat_id },user: User,message_content:images[i].url,message_type:'image',_createdAt:(new Date()).toGMTString()}]);
      User.ws.emit('msg',image_payload);
    }
    setImages([]);
    if(message_content.length > 0){
      let payload = { chat_id: chat.chat_id, message_content, message_type:'text' };
      User.ws.emit('msg',payload);
      setMessages(cur => [...cur,{ chat:{ _id: chat.chat_id }, user: User, message_content, message_type:'text',_createdAt:(new Date()).toGMTString()}]);
      setMessageContent('');
    }
    
  }

  function uploadImage(evt){
    let form = new FormData();
    form.append('upload_image',evt.target.files[0]);
    form.append('user_id',User.user_id);
    axios.post('/api/v1/upload_image',form,{
        // TODO: implement a bar progress ui for sending images in the chat
        onUploadProgress: (progressEvent) => console.log((progressEvent.loaded/progressEvent.total)*100,'%')
    }).then((response) => {
      console.log({ res: response.data });
      if(response.data.status === "success"){
        setImages(state => [...state,response.data.image]);
      }
    })
  }

  function toggleEmojiPicker(){
    if(emojiPickerOpen){
      emojiPickerAnim.start({
        opacity: 0,
        transition:{
          duration: 0.5
        }
      }).then(() => {
        emojiPickerAnim.set({ display: "none" });
        setEmojiPickerOpen(false);
      });
    }else{
      emojiPickerAnim.start({
        display: "block",
        opacity: 1,
        transition:{
          duration: 0.5
        }
      }).then(() => {
        setEmojiPickerOpen(true);
      });
    }
  }

  return(
    <div className='md:w-5/6 w-full flex flex-col lg:w-4/6 items-center h-full'>
        <div className='w-11/12 py-2 px-4 flex flex-row bg-[#fafbff] rounded-xl'>
            <div className='md:w-2/12 lg:w-1/12'>
                <img className='object-cover w-14 h-14 rounded-full' src={chat.profile_image ? chat.profile_image : "/profile.jpeg"} />
            </div>
            <div className='flex flex-col w-11/12 px-2'>
            <div className='font-mono font-semibold text-lg text-[#000049]'>{chat.username || chat.name || User.username}</div>
            <div className='font-mono text-sm text-[#acb2c8]'>{(chat.bio || User.bio || 'Hacker!')}</div>
            </div>
        </div>
        <div className='w-11/12 py-4 px-4 flex flex-col bg-[#fafbff] rounded-xl my-4 overflow-auto h-full'>
            <div ref={messages_box} className={'flex flex-col w-full overflow-auto px-2 flex-grow'}>
              {
                  messages.map((msg, i) => <Message key={i} msg={msg} User={User} />)
              }
            </div>
            {
            (images.length > 0) ? (
                <div className='flex flex-col w-full bg-[#7f82de] rounded-lg'>
                <div className='w-full flex items-end justify-end p-1 text-white'><FaTimes /></div>
                <div className='w-full flex flex-row overflow-auto rounded-lg p-2'>
                    {
                    images.map(( img, index) => {
                        return(
                        <div key={index} className='flex flex-col shadow-lg rounded-lg w-28 mx-2'>
                            <img className="rounded-lg w-28" alt="image" src={img.url} />
                        </div>
                        )
                    })
                    }
                </div>
                </div>
            ) : ('')
            }
            <div className='w-full bg-[#ffffff] rounded-xl px-4 py-2 flex flex-row shadow-xl items-center'>
                <input onChange={isValidChat ? uploadImage : ""} ref={upload_image} type={"file"} hidden={true} />
                <input onKeyUp={(evt) => { if(evt.code === 'Enter'){ if(isValidChat) { sendMsg() } }}} value={message_content} onChange={(e) => setMessageContent(e.target.value)} className='w-9/12 text-base font-mono px-4 py-2 bg-transparent' placeholder='type a message' />
                <div className='w-1/12 relative'>
                  <FaSmile onClick={toggleEmojiPicker} className='cursor-pointer text-base font-mono text-[#a9bae8]' />
                  <motion.div animate={emojiPickerAnim} className='absolute hidden opacity-0 bottom-full right-full'>
                    <EmojiPicker onEmojiClick={(emoji,event) => setMessageContent(state => state+=emoji.emoji)} />
                  </motion.div>
                </div>
                <FaPaperclip onClick={() => { if(isValidChat){ upload_image.current.click() }} } className='cursor-pointer w-1/12 text-base font-mono text-[#a9bae8]' />
                <FaPaperPlane onClick={isValidChat ? sendMsg : ""} className='cursor-pointer w-1/12 text-base font-mono text-[#a9bae8]' />
            </div>
        </div>
    </div>
  )
}

const Message = ({ msg, User }) => {
  const usernameRef = useRef();

  function onHoverStart(){
    usernameRef.current.style.display = "block";
  }
  
  function onHoverEnd(){
    usernameRef.current.style.display = "none";
  }

  if(msg.user._id === User._id){
    if(msg.message_type === "text"){
      return (
        <div className='flex flex-col max-w-5/6 self-end'>
          <div className='font-mono text-white text-sm bg-[#6b1aff] w-fit px-4 py-2 rounded-t-xl rounded-l-xl'>{msg.message_content}</div>
          <div className='text-xs text-end text-[#c3c9d7] font-mono my-1'>{(new Date(msg._createdAt)).toLocaleTimeString('en-US',{ hour12:true,hour:'2-digit',minute:'2-digit'})}</div>
        </div>
      )
    }
  
    if(msg.message_type === "image"){
      return (
        <div className='flex flex-col max-w-5/6 self-end'>
          <img className='flex self-end shadow-xl rounded-lg border-2 w-1/3' src={msg.message_content}/>
          <div className='text-xs text-end text-[#c3c9d7] font-mono my-1'>{(new Date(msg._createdAt)).toLocaleTimeString('en-US',{ hour12:true,hour:'2-digit',minute:'2-digit'})}</div>
        </div>
      )
    }
  }else{
    if(msg.message_type === "text"){
      return (
        <div className='flex flex-col max-w-5/6 self-start'>
          <div className='w-full flex flex-row'>
            <div className='relative'>
              <img onMouseEnter={onHoverStart} onMouseLeave={onHoverEnd} className='h-10 w-10 rounded-full cursor-pointer' src={msg.user.profile_image || "/profile.jpeg"} />
              <div ref={usernameRef} className='absolute top-11 bg-gray-300 rounded-lg px-2 hidden text-xs font-mono font-medium text-gray-400' >{msg.user.username}</div>
            </div>
            <div className='ml-2 flex flex-col'>
              <div className='font-mono text-[#8f96a9] text-sm bg-[#eef2fd] w-fit px-4 py-2 rounded-t-xl rounded-r-xl'>{msg.message_content}</div>
              <div className='text-xs text-start text-[#c3c9d7] font-mono my-1'>{(new Date(msg._createdAt)).toLocaleTimeString('en-US',{ hour12:true,hour:'2-digit',minute:'2-digit'})}</div>
            </div>
          </div>
        </div>
      )
    }

    if(msg.message_type === "image"){
      return (
        <div className='flex flex-col max-w-5/6 self-start'>
          <div className='w-full flex flex-row'>
            <div className='relative'>
              <img onMouseEnter={onHoverStart} onMouseLeave={onHoverEnd} className='h-10 w-10 rounded-full cursor-pointer' src={msg.user.profile_image || "/profile.jpeg"} />
              <div ref={usernameRef} className='absolute top-11 bg-gray-300 rounded-lg px-2 hidden text-xs font-mono font-medium text-gray-400' >{msg.user.username}</div>
            </div>
            <div className='ml-2 flex flex-col'>
              <img className='flex self-start shadow-xl rounded-lg border-2 w-1/3' src={msg.message_content}/>
              <div className='text-xs text-start text-[#c3c9d7] font-mono my-1'>{(new Date(msg._createdAt)).toLocaleTimeString('en-US',{ hour12:true,hour:'2-digit',minute:'2-digit'})}</div>
            </div>
          </div>
        </div>
      )
    } 
  }
}