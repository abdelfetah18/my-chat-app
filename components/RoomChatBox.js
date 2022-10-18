import { useEffect, useRef, useState } from 'react';
import { FaHome,FaCommentAlt,FaCog,FaBell,FaSearch,FaPaperPlane,FaPaperclip,FaSmile,FaTimes } from 'react-icons/fa';
import axios from 'axios';

export default function RoomChatBox({ User,room,setMyRooms,messages,setMessages }){
    var [message,setMessage] = useState('');
    var [images,setImages] = useState([]);
    var upload_image = useRef();
    var messages_box = useRef();

    if(!room){
        room = { ...User,name:User.username }
    }

    useEffect(() => {
        messages_box.current.scrollTo({
          top: messages_box.current.scrollHeight,
          behavior: 'smooth'
        })
        updateRooms();
    },[messages]);

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

    return(
        <div className='md:w-5/6 w-full flex flex-col lg:w-4/6 items-center h-full'>
            <div className='w-11/12 py-2 px-4 flex flex-row bg-[#fafbff] rounded-xl'>
                <div className='md:w-2/12 lg:w-1/12'>
                <img className='object-cover w-14 h-14 rounded-full' src={(room.profile_image != null ? room.profile_image : '/profile.jpeg')} />
                </div>
                <div className='flex flex-col w-11/12 px-2'>
                <div className='font-mono font-semibold text-lg text-[#000049]'>{room.name}</div>
                <div className='font-mono text-sm text-[#acb2c8]'>{room.bio}</div>
                </div>
            </div>
            <div className='w-11/12 py-4 px-4 flex flex-col bg-[#fafbff] rounded-xl my-4 overflow-auto h-full'>
                <div ref={messages_box} className={'flex flex-col w-full overflow-auto flex-grow'}>
                {
                    messages.map((msg,i) => {
                    if(msg.user._ref === User.user_id){
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
    )
}