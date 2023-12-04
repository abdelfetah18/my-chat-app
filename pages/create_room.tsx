import Navigation from "../components/Navigation";
import { FaBell, FaCamera } from 'react-icons/fa';
import { useEffect, useRef, useState } from "react";
import { getUser } from '../database/client';
import axios from "axios";
import SubmitButton from "../components/SubmitButton";

export async function getServerSideProps({ req }) {
    let user_info = req.userSession;
    let user = await getUser(user_info.user_id);
   
    return {
        props: { user }
    }
}

export default function CreateRoom({ user }){
    let [User,setUser] = useState(user);
    let [room_name,setRoomName] = useState('');
    let [room_bio,setRoomBio] = useState('');

    const profileImageInput = useRef<HTMLInputElement>(null);
    const [profileImage, setProfileImage] = useState("");

    useEffect(() => {
        let access_token = localStorage.getItem('access_token');
        setUser(state => { return { ...state,access_token } });
    },[]);

    async function create_room(ev){
        // Create room.
        let response = await axios.post('/api/v1/room/create',{ room_name, room_bio },{ headers: { authorization:User.access_token } });
        let payload = response.data;
        payload.redirect = "/rooms/"+payload.data.room._id;
        
        // Upload room image if exist.
        if(profileImageInput.current.value){
            let form = new FormData();
            form.append('profile_image', profileImageInput.current.files[0]);
            form.append('room_id', payload.data.room._id);
            let response = await axios.post('/api/v1/room/upload_profile_image', form);
        }
        
        return payload;
    }

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
    
            reader.onload = function (e) {
                setProfileImage(e.target.result.toString());
            }
    
            reader.readAsDataURL(input.files[0]);
        }
    }

    function onChoseImage(ev){
        readURL(ev.target);
    }

    return (
        <div className='flex flex-col sm:flex-row background h-screen w-screen'>
            <Navigation page={'/create_room'} />
            <div className='lg:w-5/6 md:w-11/12 w-full flex-grow bg-[#f1f5fe] md:rounded-l-3xl flex flex-col items-center py-4'>
                <div className='w-11/12 flex flex-row justify-end items-center py-2'>
                    <FaBell className='font-mono text-[#ccd8e8] mx-1 text-base' />
                    <div className='font-mono text-[#9199a8] mx-1 text-sm'>Notifications</div>
                </div>
                <div className='w-11/12 text-start font-mono font-bold text-2xl py-2 text-[#02166c]'>Create a room</div>
                <div className="w-11/12 flex flex-col items-center">
                    <div className="lg:w-1/2 w-full flex flex-col">
                        <div className="font-mono text-lg font-semibold">Room info:</div>
                        <div className="w-full flex flex-col items-center">
                            <div className="lg:w-20 lg:h-20 w-40 h-40 bg-red-500 rounded-full relative my-8">
                                <input ref={profileImageInput} type="file" accept="image/*" hidden onChange={onChoseImage} />
                                <img className="h-full w-full rounded-full" src={profileImage ? profileImage : "/profile.png"} />
                                <div onClick={() => profileImageInput.current.click()} className="absolute p-2 rounded-full bg-blue-700 hover:bg-blue-600 cursor-pointer lg:bottom-0 lg:right-0 bottom-2 right-2">
                                    <FaCamera className="text-gray-50 lg:text-xs text-lg" />
                                </div>
                            </div>
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
            </div>
        </div>
    )
}