import { useEffect, useRef, useState } from 'react';
import { FaHome,FaCommentAlt,FaCog,FaBell,FaSearch,FaPaperPlane,FaPaperclip,FaSmile,FaTimes } from 'react-icons/fa';
import Navigation from '../../components/Navigation';
import { getData } from '../../database/client';
import axios from 'axios';

export async function getServerSideProps({ req,params }) {
    var { room_id } = params;
    var user_info = req.decoded_jwt;
    var rooms = await getData('*[_type=="room_members" && state=="accept" && member._ref==$user_id]{"room":*[_type=="rooms" && @._id == ^.room._ref][0]{_id,name,bio,"profile_image":profile_image.asset->url,"cover_image":cover_image.asset->url},"message":*[_type=="room_messages" && @.room._ref==^.room._ref] | order(@._createdAt desc)[0],} | order(@.message._createdAt desc)',{ user_id:user_info.user_id });
    var room = await getData('*[_type=="rooms" && _id==$room_id]{_id,name,bio,"profile_image":profile_image.asset->url,"cover_image":cover_image.asset->url,"messages":*[_type=="room_messages" && @.room._ref == ^._id] | order(@._createdAt asc)}[0]',{ room_id });
    var room_requests = await getData('*[_type=="room_members" && member._ref==$user_id && room._ref==$room_id && role=="admin"][0]{"member_requests":*[_type=="room_members" && ^.room._ref==@.room._ref && @.state=="request"]{ _id,"user":*[_type=="users" && @._id==^.member._ref]{_id,username,bio,"profile_image":profile_image.asset->url,"cover_image":cover_image.asset->url}[0],state}}',{ room_id,user_id:user_info.user_id });

    return {
        props: {
            rooms,user:user_info,room,room_requests
        }
    }
}

export default function Room({ rooms,user,room,room_requests }) {
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var [User,setUser] = useState(user);
  var [message,setMessage] = useState('');
  var [messages,setMessages] = useState(room.messages);
  var [my_rooms,setMyRooms] = useState(rooms);
  var [images,setImages] = useState([]);
  var upload_image = useRef();
  var messages_box = useRef();
  
  useEffect(() => {
    messages_box.current.scrollTo({
      top: messages_box.current.scrollHeight,
      behavior: 'smooth'
    })
    updateRooms();
  },[messages]);

  useEffect(() => {
      var access_token = localStorage.getItem('access_token');
      var ws = new WebSocket(process.env.NODE_ENV ? 'wss://my-chat-dapp.herokuapp.com/'+'/?room_id='+room._id+'&type=room&access_token='+access_token : 'ws://'+location.host.replace('3000','4000')+'/?room_id='+room._id+'&type=room&access_token='+access_token);

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

      ws.addEventListener('room-msg',({ detail:payload }) => {
        console.log(payload);
        if(payload.room._ref === room._id){
          setMessages(cur => [...cur,payload]);
        }
      });

      setUser(state => { return { ...state,access_token,ws } });
  },[]);

  function updateRooms(){
    axios.get('/api/v1/user/rooms',{
      headers:{
        authorization:User.access_token
      }
    }).then((response) => {
      if(response.data.status == 'success'){
        setMyRooms(response.data.data);
      }
    });
  }
  
  function uploadImage(evt){
    var form = new FormData();
    form.append('upload_image',evt.target.files[0]);
    form.append('user_id',User.user_id);
    axios.post('/api/v1/upload_image',form,{
        onUploadProgress: (progressEvent) => console.log((progressEvent.loaded/progressEvent.total)*100,'%')
    }).then((response) => {
      if(response.data.status === "success"){
        setImages(state => [...state,response.data.image]);
      }
    })
  }

  function sendMsg(e){
    for(var i=0;i<images.length;i++){
      var image_payload = { room_id:room._id,message:images[i].url,type:'image' };
      User.ws.emit('room-msg',image_payload);
      setMessages(cur => [...cur,{ room:{ _ref:room._id },user:{ _ref:User.user_id },message:images[i].url,type:'image',created_at:(new Date()).toGMTString()}]);
    
    }
    setImages([]);
    if(message.length > 0){
      var payload = { room_id:room._id,message,type:'text' };
      User.ws.emit('room-msg',payload);
      setMessages(cur => [...cur,{ room:{ _ref:room._id },user:{ _ref:User.user_id },message,type:'text',created_at:(new Date()).toGMTString()}]);
      setMessage('');
    }
  }
  
    if(room != null){
      return (
        <div className='flex flex-row background h-screen w-screen'>
          <Navigation page={'/rooms'} />
          <div className='lg:w-5/6 md:w-11/12 w-full bg-[#f1f5fe] rounded-l-3xl flex flex-col px-10 py-4'>
            <div className='w-full flex flex-row justify-end items-center px-4 py-2'>
              <div className='font-mono text-[#9199a8] mx-1 text-sm'>state:Sale</div>
              <FaBell className='font-mono text-[#ccd8e8] mx-1 text-base' />
            </div>
            <div className='w-full text-start font-mono font-bold text-2xl px-4 py-2 text-[#02166c]'>Room</div>
            <div className='flex flex-row w-full'>
              <div className='md:w-1/6 lg:flex md:flex hidden flex-col lg:w-2/6 items-center'>
                <div className='md:hidden my-2 lg:flex flex-row w-5/6 bg-[#fafbff] items-center px-4 py-2 rounded-xl'>
                  <input className='w-11/12 font-mono text-xl bg-transparent px-4' placeholder='Search' />
                  <FaSearch className='w-1/12 text-[#c8cee5]' />
                </div>
    
                {
                  my_rooms.map((c,i) => {
                    function calcTime(timestamp,diveder){
                      return[Math.floor(timestamp/diveder),timestamp % diveder];
                    }
                    var time_ago = (c.message != null) ? Date.now() - (new Date(c.message.created_at || c.message._createdAt)) : 0;
                    var [days,r_days] = calcTime(time_ago,1000*60*60*24);
                    var [hours,r_hours] = calcTime(r_days,1000*60*60);
                    var [minutes,r_minutes] = calcTime(r_hours,1000*60);
                    var [seconds,mileseconds] = calcTime(r_minutes,1000);

                    return(
                        <div key={i} onClick={() => window.location.href = '/rooms/'+c.room._id } className='md:w-fit hover:shadow-xl cursor-pointer my-2 flex flex-row lg:w-5/6 bg-[#fafbff] items-center px-4 py-2 rounded-xl'>
                            <div className='lg:w-1/6 md:w-full'>
                                <img className='object-cover w-14 h-14 rounded-full border-white border-[3px]' src={(c.room.profile_image != null ? c.room.profile_image : '/profile.jpeg')} />
                            </div>
                            <div className='lg:flex flex-col lg:w-5/6 md:hidden'>
                                <div className='w-full text-end font-mono text-xs font-semibold text-[#a2aac1]'>{(c.message != null) ? ((days > 1) ? ((new Date(c.message.created_at || c.message._createdAt)).getDate().toString()+' '+months[(new Date(c.message.created_at || c.message._createdAt)).getMonth()]) : (hours != 0 ? hours.toString()+' hours' : minutes.toString()+' minutes' )) : ''}</div>
                                <div className='flex flex-row w-full'>
                                    <div className='flex flex-col w-11/12 px-2'>
                                        <div className='font-mono text-base font-bold text-[#020762]'>{c.room.name}</div>
                                        <div className='font-mono text-xs font-medium text-[#b7bfcc] text-ellipsis w-full'>{ c.message != null ? (c.message.user._ref === user.user_id ? 'you: '+(c.message.type === "text" ? c.message.message : 'send a '+c.message.type) : (c.message.type === "text" ? c.message.message : 'send a '+c.message.type)) : '' }</div>
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

                {
                  room_requests != null ? (
                  <div className='w-11/12 flex flex-col'>
                    <div className='w-11/12 text-lg font-mono font-semibold text-[#02166c]'>new members requests:</div>
                    <div className='w-11/12 flex flex-col'>
                      {
                        room_requests.member_requests.map((r,i) => {
                          function accept(){
                            axios.post('/api/v1/accept?type=room',{ request_id:r._id },{ headers:{ authorization:User.access_token }}).then((response) => console.log('response:',response.data));
                          }   

                          function reject(){
                            axios.post('/api/v1/reject?type=room',{ request_id:r._id },{ headers:{ authorization:User.access_token }}).then((response) => console.log('response:',response.data));
                          }  

                          return(
                            <div key={i} className='w-full hover:shadow-xl cursor-pointer my-2 flex flex-row bg-[#fafbff] items-center px-4 py-2 rounded-xl'>
                              <div className='lg:w-1/6 md:w-full'>
                                  <img className='object-cover w-14 h-14 rounded-full' src={r.user.profile_image != null ? r.user.profile_image : '/profile.jpeg'} />
                              </div>
                              <div className='lg:flex flex-col lg:w-5/6 md:hidden'>
                                  <div className='w-full text-end font-mono text-xs font-semibold text-[#a2aac1]'>{/*(c.message != null) ? ((days > 1) ? ((new Date(c.message.created_at || c.message._createdAt)).getDate().toString()+' '+months[(new Date(c.message.created_at || c.message._createdAt)).getMonth()]) : (hours != 0 ? hours.toString()+' hours' : minutes.toString()+' minutes' )) : ''*/}20 june</div>
                                  <div className='flex flex-row w-full'>
                                      <div className='flex flex-col w-11/12 px-2'>
                                          <div className='font-mono text-base font-bold text-[#020762]'>{r.user.username}</div>
                                      </div>
                                  </div>
                                  <div className='flex flex-row w-full justify-end'>
                                    <div onClick={accept} className='mx-2 font-mono text-base font-bold text-white px-4 bg-green-400 rounded text-center'>accept</div>
                                    <div onClick={reject} className='mx-2 font-mono text-base font-bold text-white px-4 bg-red-400 rounded text-center'>reject</div>
                                  </div>
                              </div>
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                  ) : ('')
                }
    
              </div>
              <div className='md:w-5/6 w-full flex flex-col lg:w-4/6 items-center'>
                <div className='w-11/12 py-2 px-4 flex flex-row bg-[#fafbff] rounded-xl'>
                  <div className='md:w-2/12 lg:w-1/12'>
                    <img className='object-cover w-14 h-14 rounded-full' src={(room.profile_image != null ? room.profile_image : '/profile.jpeg')} />
                  </div>
                  <div className='flex flex-col w-11/12 px-2'>
                    <div className='font-mono font-semibold text-lg text-[#000049]'>{room.name}</div>
                    <div className='font-mono text-sm text-[#acb2c8]'>{room.bio}</div>
                  </div>
                </div>
                <div className='w-11/12 py-4 px-4 flex flex-col bg-[#fafbff] rounded-xl my-4'>
                  <div ref={messages_box} className={'flex flex-col w-full overflow-auto px-2 '+(images.length > 0 ? "h-[20em] max-h-[20em]" : "h-[28em] max-h-[28em]")}>
                    {
                      messages.map((msg,i) => {
                        if(msg.user._ref === user.user_id){
                          if(msg.type === "text"){
                            return (
                              <div key={i} className='flex flex-col max-w-5/6 self-end'>
                                <div className='font-mono text-white text-sm bg-[#6b1aff] w-fit px-4 py-2 rounded-t-xl rounded-l-xl'>{msg.message}</div>
                                <div className='text-xs text-end text-[#c3c9d7] font-mono my-1'>{(new Date(msg.created_at || msg._createdAt)).toLocaleTimeString('en-US',{ hour12:true,hour:'2-digit',minute:'2-digit'})}</div>
                              </div>
                            )
                          }
                          if(msg.type === "image"){
                            return (
                              <div key={i} className='flex flex-col max-w-5/6 self-end'>
                                <img className='flex self-end shadow-xl rounded-lg border-2 w-1/3' src={msg.message}/>
                                <div className='text-xs text-end text-[#c3c9d7] font-mono my-1'>{(new Date(msg.created_at || msg._createdAt)).toLocaleTimeString('en-US',{ hour12:true,hour:'2-digit',minute:'2-digit'})}</div>
                              </div>
                            )
                          }
                        }else{
                          if(msg.type === "text"){
                            return (
                              <div key={i} className='flex flex-col max-w-5/6 self-start'>
                                <div className='font-mono text-[#8f96a9] text-sm bg-[#eef2fd] w-fit px-4 py-2 rounded-t-xl rounded-r-xl'>{msg.message}</div>
                                <div className='text-xs text-start text-[#c3c9d7] font-mono my-1'>{(new Date(msg.created_at || msg._createdAt)).toLocaleTimeString('en-US',{ hour12:true,hour:'2-digit',minute:'2-digit'})}</div>
                              </div>
                            )
                          }
                          if(msg.type === "image"){
                            return (
                              <div key={i} className='flex flex-col max-w-5/6 self-start'>
                                <img className='flex self-start shadow-xl rounded-lg border-2 w-1/3' src={msg.message}/>
                                <div className='text-xs text-start text-[#c3c9d7] font-mono my-1'>{(new Date(msg.created_at || msg._createdAt)).toLocaleTimeString('en-US',{ hour12:true,hour:'2-digit',minute:'2-digit'})}</div>
                              </div>
                            )
                          }
                        }
                      })
                    }
                  
                  </div>
                  {
                    (images.length > 0) ? (
                      <div className='flex flex-col w-full bg-[#7f82de] rounded-lg'>
                        <div className='w-full flex items-end justify-end p-1 text-white'><FaTimes /></div>
                        <div className='w-full flex flex-row overflow-auto rounded-lg p-2'>
                          {
                            images.map(( img, index) => {
                              console.log('image:',img);
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
                    <input onChange={uploadImage} ref={upload_image} type={"file"} hidden={true} />
                    <input onKeyUp={(evt) => { if(evt.code === 'Enter'){ sendMsg() }}} value={message} onChange={(e) => setMessage(e.target.value)} className='w-9/12 text-base font-mono px-4 py-2 bg-transparent' placeholder='type a message' />
                    <FaSmile className='cursor-pointer w-1/12 text-base font-mono text-[#a9bae8]' />
                    <FaPaperclip onClick={() => upload_image.current.click() } className='cursor-pointer w-1/12 text-base font-mono text-[#a9bae8]' />
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
        <div>Room_id Not Found!</div>
      )
    }
}
