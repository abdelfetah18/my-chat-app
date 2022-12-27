import Navigation from "../components/Navigation";
import { FaBell } from 'react-icons/fa';
import { useEffect, useState } from "react";
import { getData } from '../database/client';
import axios from "axios";
import { motion, useAnimation } from "framer-motion";

export async function getServerSideProps({ req }) {
    var user_info = req.decoded_jwt;
    var user = await getData('*[_type=="users" && _id==$user_id][0]{ "user_id":_id,username,"profile_image":profile_image.asset->url,"cover_image":cover_image.asset->url,bio }',{ user_id:user_info.user_id });

    return {
        props: {
            user
        }
    }
}

export default function CreateRoom({ user }){
    var [User,setUser] = useState(user);
    var [room_name,setRoomName] = useState('');
    var [room_bio,setRoomBio] = useState('');
    var [alertMessage,setAlertMessage] = useState('');
    var alertMsg = useAnimation();
    

    useEffect(() => {
        var access_token = localStorage.getItem('access_token');
        setUser(state => { return { ...state,access_token } })
    },[]);

    function create_room(e){
        axios.post('/api/v1/create',{ room_name,room_bio },{
            headers:{
                authorization:User.access_token
            }
        }).then((response) => {
            setAlertMessage(response.data.message);
            if(response.data.status == 'success'){
                alertMsg.start({
                    height:'32px',
                    transform:"initial",
                    scaleY:1,
                    backgroundColor:'#2bff2b'
                },{
                    duration:0.5
                }).finally(() => {
                    alertMsg.start({
                        height:'0px',
                        transform:"initial",
                        scaleY:0,
                    },{
                        duration:0.5,
                        delay:2
                    })
                })
            }else{
                alertMsg.start({
                    height:'32px',
                    transform:"initial",
                    scaleY:1,
                    backgroundColor:'#ff2b2b'
                },{
                    duration:0.5
                }).finally(() => {
                    alertMsg.start({
                        height:'0px',
                        transform:"initial",
                        scaleY:0,
                    },{
                        duration:0.5,
                        delay:2
                    })
                })
            }
        });
    }

    return(
        <div className='flex flex-row background h-screen w-screen'>
            <Navigation page={'/create_room'} />
            <div className='lg:w-5/6 md:w-11/12 w-full bg-[#f1f5fe] rounded-l-3xl flex flex-col px-10 py-4'>
                <div className='w-full flex flex-row justify-end items-center px-4 py-2'>
                    <div className='font-mono text-[#9199a8] mx-1 text-sm'>state:Sale</div>
                    <FaBell className='font-mono text-[#ccd8e8] mx-1 text-base' />
                </div>
                <div className='w-full text-start font-mono font-bold text-2xl px-4 py-2 text-[#02166c]'>Create a room</div>
                <div className='flex flex-row w-full'>
                    <div className="w-1/2 flex flex-col">
                        <div className="w-11/12 flex flex-col">
                            <div className="font-mono text-lg font-semibold">Room info:</div>
                            <div className="w-full flex flex-col items-center">
                                <div className="flex flex-col w-11/12 my-1">
                                    <div className="font-mono text-base font-medium">room name:</div>
                                    <input onChange={(e) => setRoomName(e.target.value)} value={room_name} className="font-mono text-base font-medium rounded p-2" placeholder="room name" />
                                </div>
                                <div className="flex flex-col w-11/12 my-1">
                                    <div className="font-mono text-base font-medium">room bio:</div>
                                    <input onChange={(e) => setRoomBio(e.target.value)} value={room_bio} className="font-mono text-base font-medium rounded p-2" placeholder="room bio" />
                                </div>
                                <motion.div animate={alertMsg} className="flex flex-col w-11/12 h-0 bg-green-500 rounded items-start justify-center">
                                    <motion.div animate={alertMsg} className="scale-y-0 ease-linear text-base font-mono font-medium text-white mx-4 h-full" >{alertMessage}</motion.div>
                                </motion.div>
                                <div onClick={create_room} className="flex flex-col w-11/12 my-2 items-center">
                                    <div className="cursor-pointer px-4 py-2 bg-blue-500 rounded text-white font-mono text-base font-semibold">create</div>
                                </div>
                            </div> 
                        </div>
                    </div>
                    <div className="w-1/2 flex flex-col">
                        <div className="w-11/12 flex flex-col">
                            <div className="font-mono text-lg font-semibold">Rooms you may like to join:</div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}