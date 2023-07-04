import Navigation from "../components/Navigation";
import { FaBell } from 'react-icons/fa';
import { useEffect, useState } from "react";
import { getExploreRooms, getUser } from '../database/client';
import axios from "axios";
import { motion, useAnimation } from "framer-motion";
import ExploreRooms from "../components/ExploreRooms";
import SubmitButton from "../components/SubmitButton";

export async function getServerSideProps({ req }) {
    let user_info = req.decoded_jwt;
    let user = await getUser(user_info.user_id);
    let rooms_you_may_like = await getExploreRooms(user_info.user_id);
   
    return {
        props: {
            user, rooms_you_may_like
        }
    }
}

export default function CreateRoom({ user, rooms_you_may_like }){
    let [User,setUser] = useState(user);
    let [room_name,setRoomName] = useState('');
    let [room_bio,setRoomBio] = useState('');
    let [alertMessage,setAlertMessage] = useState('');
    let [RoomsYouMayLike,setRoomsYouMayLike] = useState(rooms_you_may_like);
    let alertMsg = useAnimation();
    

    useEffect(() => {
        let access_token = localStorage.getItem('access_token');
        setUser(state => { return { ...state,access_token } })
    },[]);

    function updateContent(){
        axios.get('/api/v1/user/you_may',{ headers:{ authorization:User.access_token } }).then((response) => {
            let data = response.data.data;
            setRoomsYouMayLike(data.rooms_you_may_like);
        });
    }

    async function create_room(ev){
        let response = await axios.post('/api/v1/room/create',{ room_name, room_bio },{ headers: { authorization:User.access_token } });
        let payload = response.data;
        payload.redirect = "/rooms/"+payload.data.room._id;
        return payload;
    }

    return (
        <div className='flex flex-row background h-screen w-screen'>
            <Navigation page={'/create_room'} />
            <div className='lg:w-5/6 md:w-11/12 w-full bg-[#f1f5fe] rounded-l-3xl flex flex-col px-10 py-4'>
                <div className='w-full flex flex-row justify-end items-center px-4 py-2'>
                    <FaBell className='font-mono text-[#ccd8e8] mx-1 text-base' />
                    <div className='font-mono text-[#9199a8] mx-1 text-sm'>Notifications</div>
                </div>
                <div className='w-full text-start font-mono font-bold text-2xl py-2 text-[#02166c]'>Create a room</div>
                <div className='flex flex-row w-full'>
                    <div className="w-1/2 flex flex-col">
                        <div className="w-11/12 flex flex-col">
                            <div className="font-mono text-lg font-semibold">Room info:</div>
                            <div className="w-full flex flex-col items-center">
                                <div className="flex flex-col w-11/12 my-1">
                                    <div className="font-mono text-base font-medium">Room name:</div>
                                    <input onChange={(e) => setRoomName(e.target.value)} value={room_name} className="font-mono text-base font-medium rounded p-2" placeholder="Room name" />
                                </div>
                                <div className="flex flex-col w-11/12 my-1">
                                    <div className="font-mono text-base font-medium">Room bio:</div>
                                    <input onChange={(e) => setRoomBio(e.target.value)} value={room_bio} className="font-mono text-base font-medium rounded p-2" placeholder="Room bio" />
                                </div>
                                <SubmitButton onClick={create_room} text={"Create"} className={"bg-blue-500 text-gray-50"} wrapperClassName={"mt-8"} />
                            </div> 
                        </div>
                    </div>
                    <div className="w-1/2 flex flex-col">
                        <ExploreRooms RoomsYouMayLike={RoomsYouMayLike} User={User} updateContent={updateContent} />
                    </div>
                </div>
            </div>
        </div>
    )
}