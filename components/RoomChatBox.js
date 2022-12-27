import { useEffect, useRef, useState } from 'react';
import { FaPaperPlane,FaPaperclip,FaSmile,FaTimes, FaEllipsisH, FaCamera } from 'react-icons/fa';
import { motion, useAnimation } from 'framer-motion';
import axios from 'axios';


export default function RoomChatBox({ User,room,setMyRooms,messages,setMessages }){
    var [message,setMessage] = useState('');
    var [images,setImages] = useState([]);
    var upload_image = useRef();
    var messages_box = useRef();
    var room_settings_box = useAnimation();
    var [room_name,setRoomName] = useState(room.name);
    var [room_bio,setRoomBio] = useState(room.bio);
    var [room_profile_image,setRoomProfileImage] = useState(room.profile_image);
    var uploadBox = useRef();

    function openSettings(){
        room_settings_box.start({
            display: "flex",
            opacity: 1,
            transition:{ duration: 0.5 },

        }).then(() => console.log("room_settings opened!"));
    }

    function closeSettings(){
        room_settings_box.start({
            opacity: 0,
            transition: { duration: 0.5 },
        }).then(() => {
            room_settings_box.set({ display: "none" });
            console.log("room_settings closed!")
        });
    }

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

    function uploadRoomProfileImage(evt){
        // TODO: implement a upload progress bar.
        var form = new FormData();
        form.append('profile_image',evt.target.files[0]);
        form.append('room_id',room._id);
        axios.post('/api/v1/room/upload_profile_image',form,{
           // onUploadProgress: (progressEvent) => setUploadProgress((progressEvent.loaded/progressEvent.total)*100,'%')
        }).then((response) => {
            //setUploadProgress(0);
            console.log('response:',response.data);
            setRoomProfileImage(response.data.profile_image.url);
        });
    }

    function updateRoomInfo(){
        axios.post("/api/v1/room/edit", { room_id: room._id, room_name, room_bio }).then((result) => { 
            if(result.data.status == "success"){
                // show a success message and then reload
                window.location.reload();
            }else{
                // TODO: show a fail message!
                alert(result.data.message);
            }
        }).catch(err => {
            // TODO: check the error and show a message
            console.log(err);
        });
    }

    return(
        <div className='md:w-5/6 w-full flex flex-col lg:w-4/6 items-center h-full'>
            <div className='w-11/12 py-2 px-4 flex flex-row bg-[#fafbff] rounded-xl'>
                <div className='md:w-2/12 lg:w-1/12'>
                    <img className='object-cover w-14 h-14 rounded-full' src={(room_profile_image != null ? room_profile_image : '/profile.jpeg')} />
                </div>
                <div className='flex flex-col flex-grow px-2'>
                    <div className='font-mono font-semibold text-lg text-[#000049]'>{room.name}</div>
                    <div className='font-mono text-sm text-[#acb2c8]'>{room.bio}</div>
                </div>
                <div className={(room.is_admin ? 'flex ' : '') + 'flex-col items-center justify-center'}>
                    <FaEllipsisH onClick={openSettings} className='text-[#acb2c8] cursor-pointer hover:text-[#bcc2d8]' />
                </div>
            </div>
            <div className='w-11/12 py-4 px-4 flex flex-col bg-[#fafbff] rounded-xl my-4 overflow-auto h-full'>
                <div ref={messages_box} className={'flex flex-col w-full overflow-auto flex-grow'}>
                {
                    messages.map((msg,i) => {
                    if(msg.user._ref === User.user_id){
                        if(msg.type === "text"){
                        return (
                            <div key={i} className='flex flex-col max-w-5/6 self-end pr-4'>
                                <div className='font-mono text-white text-sm bg-[#6b1aff] w-fit px-4 py-2 rounded-t-xl rounded-l-xl'>{msg.message}</div>
                                <div className='text-xs text-end text-[#c3c9d7] font-mono my-1'>{(new Date(msg.created_at || msg._createdAt)).toLocaleTimeString('en-US',{ hour12:true,hour:'2-digit',minute:'2-digit'})}</div>
                            </div>
                        )
                        }
                        if(msg.type === "image"){
                        return (
                            <div key={i} className='flex flex-col max-w-5/6 self-end pr-4'>
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

            <motion.div animate={room_settings_box} className='absolute opacity-0 hidden w-screen h-screen top-0 left-0 bg-[#00000077] flex-col items-center justify-center'>
                <div className='max-w-[900px] w-2/3 h-2/3 bg-white rounded-lg flex flex-col items-center'>
                    <div className='px-4 py-2 w-full flex flex-row items-center justify-between'>
                        <div className='text-lg font-bold '>Room Setting</div>
                        <FaTimes onClick={closeSettings} className='text-lg cursor-pointer' />
                    </div>
                    <div className='w-11/12 flex flex-col items-center'>
                        <div className='relative w-40 h-40 rounded-full'>
                            <img className='w-40 h-40 rounded-full' src={(room_profile_image != null ? room_profile_image : '/profile.jpeg')}/>
                            <div onClick={(ev) => { uploadBox.current.click(); }} className='absolute bottom-2 right-2 bg-blue-500 rounded-full p-2 cursor-pointer'>
                                <FaCamera className='text-white text-lg' />
                            </div>
                            <input ref={uploadBox} onChange={uploadRoomProfileImage} type={"file"} hidden />
                        </div>
                        <div className='w-full flex flex-col items-center'>
                            <div className='w-2/3 my-2'>
                                <div className='font-bold text-base'>Name:</div>
                                <input onChange={(ev) => setRoomName(ev.target.value)} className='bg-gray-200 w-11/12 px-4 py-1 rounded font-medium text-gray-700' placeholder='Name' value={room_name} />
                            </div>
                            <div className='w-2/3 my-2'>
                                <div className='font-bold text-base'>Bio:</div>
                                <input onChange={(ev) => setRoomBio(ev.target.value)} className='bg-gray-200 w-11/12 px-4 py-1 rounded font-medium text-gray-700' placeholder='Name' value={room_bio} />
                            </div>
                            <div onClick={updateRoomInfo} className='px-4 py-1 text-white font-bold text-base rounded-lg bg-blue-500 my-4 cursor-pointer'>Save</div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}