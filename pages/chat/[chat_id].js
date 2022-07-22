import { useEffect, useRef, useState } from 'react';
import { FaHome,FaCommentAlt,FaCog,FaBell,FaSearch,FaPaperPlane,FaPaperclip,FaSmile } from 'react-icons/fa';
import Navigation from '../../components/Navigation';
import { getData } from '../../database/client';
import axios from 'axios';

export async function getServerSideProps({ req,params }) {
    var { chat_id } = params;
    var user_info = req.decoded_jwt;
    var user = await getData('*[_type=="users" && _id==$user_id][0]{ "user_id":_id,username,"profile_image":profile_image.asset->url,"cover_image":cover_image.asset->url,bio }',{ user_id:user_info.user_id });
    var chats = await getData('*[_type=="chats" && state=="accept" && (user._ref == $user_id || inviter._ref == $user_id)]{_id,"inviter":*[_type=="users" && @._id == ^.inviter._ref][0]{ username,"profile_image":profile_image.asset->url,"cover_image":cover_image.asset->url,bio },"user":*[_type=="users" && @._id == ^.user._ref][0]{ username,"profile_image":profile_image.asset->url,"cover_image":cover_image.asset->url,bio },"message":*[_type=="messages" && @.chat._ref == ^._id] | order(@._createdAt desc)[0] } | order(message._createdAt asc)',{ user_id:user_info.user_id });
    var chat = await getData('*[_type=="chats" && state=="accept" && _id == $chat_id]{_id,"inviter":*[_type=="users" && @._id == ^.inviter._ref][0]{ _id,username,"profile_image":profile_image.asset->url,"cover_image":cover_image.asset->url,bio },"user":*[_type=="users" && @._id == ^.user._ref][0]{ _id,username,"profile_image":profile_image.asset->url,"cover_image":cover_image.asset->url,bio },"messages":*[_type=="messages" && @.chat._ref == $chat_id] | order(@._createdAt asc)}[0]',{ chat_id });

    return {
        props: {
            chats,user,chat
        }
    }
}

export default function Chat({ chats,user,chat }) {
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var [User,setUser] = useState(user);
  var [message,setMessage] = useState('');
  var [messages,setMessages] = useState(chat.messages);
  var [my_chats,setMyChats] = useState(chats);
  var messages_box = useRef();

  useEffect(() => {
    messages_box.current.scrollTo({
      top: messages_box.current.scrollHeight,
      behavior: 'smooth'
    })
    updateChats();
  },[messages]);

  useEffect(() => {
      var access_token = localStorage.getItem('access_token');
      var ws = new WebSocket(process.env.NODE_ENV ? 'wss://my-chat-dapp.herokuapp.com/'+'/?type=chat&access_token='+access_token : 'ws://'+location.host.replace('3000','4000')+'/?type=chat&access_token='+access_token);

      ws.emit = (eventName,payload) => {
        var data = JSON.stringify({ eventName,payload });
        ws.send(data);
      }

      ws.onopen = (ev) => {

      }

      ws.onmessage = (evt) => {
        var { eventName,payload } = JSON.parse(evt.data);
        console.log({ eventName,payload })
        ws.dispatchEvent(new CustomEvent(eventName,{ detail:payload }))
      }

      ws.addEventListener('msg',({ detail:payload }) => {
        if(payload.chat._ref === chat._id){
          setMessages(cur => [...cur,payload]);
        }
      });

      setUser(state => { return { ...state,access_token,ws } });
  },[]);

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
    var payload = { chat_id:chat._id,message,type:'text' };
    User.ws.emit('msg',payload);
    setMessages(cur => [...cur,{ chat:{ _ref:chat._id },user:{ _ref:User.user_id },message,type:'text',created_at:(new Date()).toGMTString()}]);
    setMessage('');
  }
  
    if(chat != null){
      return (
        <div className='flex flex-row background h-screen w-screen'>
          <Navigation page={'/chat'} />
          <div className='lg:w-5/6 md:w-11/12 w-full bg-[#f1f5fe] rounded-l-3xl flex flex-col px-10 py-4'>
            <div className='w-full flex flex-row justify-end items-center px-4 py-2'>
              <div className='font-mono text-[#9199a8] mx-1 text-sm'>state:Sale</div>
              <FaBell className='font-mono text-[#ccd8e8] mx-1 text-base' />
            </div>
            <div className='w-full text-start font-mono font-bold text-2xl px-4 py-2 text-[#02166c]'>Chat</div>
            <div className='flex flex-row w-full'>
              <div className='md:w-1/6 lg:flex md:flex hidden flex-col lg:w-2/6 items-center'>
                <div className='md:hidden my-2 lg:flex flex-row w-5/6 bg-[#fafbff] items-center px-4 py-2 rounded-xl'>
                  <input className='w-11/12 font-mono text-xl bg-transparent px-4' placeholder='Search' />
                  <FaSearch className='w-1/12 text-[#c8cee5]' />
                </div>
    
                {
                  my_chats.map((c,i) => {
                    function calcTime(timestamp,diveder){
                      return[Math.floor(timestamp/diveder),timestamp % diveder];
                    }
                    var time_ago = (c.message != null) ? Date.now() - (new Date(c.message.created_at || c.message._createdAt)) : 0;
                    var [days,r_days] = calcTime(time_ago,1000*60*60*24);
                    var [hours,r_hours] = calcTime(r_days,1000*60*60);
                    var [minutes,r_minutes] = calcTime(r_hours,1000*60);
                    var [seconds,mileseconds] = calcTime(r_minutes,1000);

                    return(
                      <div key={i} onClick={() => window.location.href = '/chat/'+c._id } className='md:w-fit hover:shadow-xl cursor-pointer my-2 flex flex-row lg:w-5/6 bg-[#fafbff] items-center px-4 py-2 rounded-xl'>
                        <div className='lg:w-1/6 md:w-full'>
                          <img className='object-cover w-14 h-14 rounded-full border-white border-[3px]' src={(user.username != c.user.username) ? (c.user.profile_image != null ? c.user.profile_image : '/profile.jpeg') : (c.inviter.profile_image != null ? c.inviter.profile_image : '/profile.jpeg')} />
                        </div>
                        <div className='lg:flex flex-col lg:w-5/6 md:hidden'>
                          <div className='w-full text-end font-mono text-xs font-semibold text-[#a2aac1]'>{(c.message != null) ? ((days > 1) ? ((new Date(c.message.created_at || c.message._createdAt)).getDate().toString()+' '+months[(new Date(c.message.created_at || c.message._createdAt)).getMonth()]) : (hours != 0 ? hours.toString()+' hours' : minutes.toString()+' minutes' )) : ''}</div>
                          <div className='flex flex-row w-full'>
                            <div className='flex flex-col w-11/12 px-2'>
                              <div className='font-mono text-base font-bold text-[#020762]'>{(user.username != c.user.username) ? (c.user.username) : (c.inviter.username)}</div>
                              <div className='font-mono text-xs font-medium text-[#b7bfcc] text-ellipsis w-full'>{ c.message != null ? (c.message.user._ref === user.user_id ? 'you: '+c.message.message : c.message.message) : '' }</div>
                            </div>
                            <div className='flex items-center justify-center w-1/12'>
                              <div className='font-mono bg-[#fd476f] rounded-full h-4 w-4 text-center text-xs text-white'>5</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                }
    
              </div>
              <div className='md:w-5/6 w-full flex flex-col lg:w-4/6 items-center'>
                <div className='w-11/12 py-2 px-4 flex flex-row bg-[#fafbff] rounded-xl'>
                  <div className='md:w-2/12 lg:w-1/12'>
                    <img className='object-cover w-14 h-14 rounded-full' src={ (chat.inviter.username === User.username ? (chat.user.profile_image != null ? chat.user.profile_image : 'profile.jpeg') : (chat.user.profile_image != null ? chat.inviter.profile_image : 'profile.jpeg'))} />
                  </div>
                  <div className='flex flex-col w-11/12 px-2'>
                    <div className='font-mono font-semibold text-lg text-[#000049]'>{ (chat.inviter.username === user.username ? chat.user.username : chat.inviter.username)}</div>
                    <div className='font-mono text-sm text-[#acb2c8]'>{ (chat.inviter.username === user.username ? (chat.user.bio != null ? chat.user.bio : 'Hacker!') : (chat.inviter.bio != null ? chat.inviter.bio : 'Hacker!')) }</div>
                  </div>
                </div>
                <div className='w-11/12 py-4 px-4 flex flex-col bg-[#fafbff] rounded-xl my-4'>
                  <div ref={messages_box} className='flex flex-col w-full h-[28em] max-h-[28em] overflow-auto px-2'>
                    {
                      messages.map((msg,i) => {
                        if(msg.user._ref === user.user_id){
                          return (
                            <div key={i} className='flex flex-col max-w-5/6 self-end'>
                              <div className='font-mono text-white text-sm bg-[#6b1aff] w-fit px-4 py-2 rounded-t-xl rounded-l-xl'>{msg.message}</div>
                              <div className='text-xs text-end text-[#c3c9d7] font-mono my-1'>{(new Date(msg.created_at || msg._createdAt)).toLocaleTimeString('en-US',{ hour12:true,hour:'2-digit',minute:'2-digit'})}</div>
                            </div>
                          )
                        }else{
                          return (
                            <div key={i} className='flex flex-col max-w-5/6 self-start'>
                              <div className='font-mono text-[#8f96a9] text-sm bg-[#eef2fd] w-fit px-4 py-2 rounded-t-xl rounded-r-xl'>{msg.message}</div>
                              <div className='text-xs text-start text-[#c3c9d7] font-mono my-1'>{(new Date(msg.created_at || msg._createdAt)).toLocaleTimeString('en-US',{ hour12:true,hour:'2-digit',minute:'2-digit'})}</div>
                            </div>
                          )
                        }
                      })
                    }
                    
    
                    
                  </div>
                  <div className='w-full bg-[#ffffff] rounded-xl px-4 py-2 flex flex-row shadow-xl items-center'>
                    <input onKeyUp={(evt) => { if(evt.code === 'Enter'){ sendMsg() }}} value={message} onChange={(e) => setMessage(e.target.value)} className='w-9/12 text-base font-mono px-4 py-2 bg-transparent' placeholder='type a message' />
                    <FaSmile className='w-1/12 text-base font-mono text-[#a9bae8]' />
                    <FaPaperclip className='w-1/12 text-base font-mono text-[#a9bae8]' />
                    <FaPaperPlane onClick={sendMsg} className='cursor-pointer w-1/12 text-base font-mono text-[#a9bae8]' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )
    }else{
      return(
        <div>Chat_id Not Found!</div>
      )
    }
}
