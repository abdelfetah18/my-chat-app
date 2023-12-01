import { getUser } from "../database/client";
import { FaBell, FaCalendar, FaUsers, FaUserFriends, FaEdit, FaEye, FaCamera } from 'react-icons/fa';
import { useEffect, useState } from "react";

import Navigation from "../components/Navigation";

import axios from "axios";
import { useRef } from "react";


export async function getServerSideProps({ req }) {
    let user_info = req.userSession;
    let user = await getUser(user_info.user_id);

    return {
        props: { user }
    }
}

export default function Home({ user }){
    let [User,setUser] = useState(user);
    let [username,setUsername] = useState(User.username);
    let [bio,setBio] = useState(User.bio || "");
    let [is_edit_state,setIsEditState] = useState(false);
    let profile_image = useRef();
    let cover_image = useRef();

    useEffect(() => {
        let access_token = localStorage.getItem('access_token');
        setUser(state => { return { ...state,access_token } });
    },[]);

    async function updateUser(){
        let response = await axios.post("/api/v1/user/update", { user_id: User._id, username, bio }, { headers:{ authorization:User.access_token } });
        if(response.data.status == "success"){
            setUser(state => ({ ...state, username, bio }));
            setIsEditState(false);
        }
    }

    function cancelEdit(){
        setIsEditState(false);
        setUsername(User.username);
        setBio(User.bio);
    }

    function updateProfileImage(){
        profile_image.current.click();
    }

    function updateCoverImage(){
        cover_image.current.click();
    }

    async function onProfileImageChange(evt){
        let form = new FormData();
        form.append('profile_image', evt.target.files[0]);
        form.append('user_id', User._id);
        let response = await axios.post('/api/v1/user/upload_profile_image', form);
        if(response.data.status == "success")
            setUser(state => ({ ...state, profile_image: response.data.data.profile_image.url }));
    }
    
    async function onCoverImageChange(evt){
        let form = new FormData();
        form.append('cover_image', evt.target.files[0]);
        form.append('user_id', User._id);
        let response = await axios.post('/api/v1/user/upload_cover_image', form);
        if(response.data.status == "success")
            setUser(state => ({ ...state, cover_image: response.data.data.cover_image.url }));
    }

    return(
        <div className='flex flex-col sm:flex-row background h-screen w-screen'>
            <Navigation page={'/'} />
            <div className='h-full lg:w-5/6 md:w-11/12 w-full bg-[#f1f5fe] sm:rounded-l-3xl flex flex-col items-center py-4'>
                <div className='w-11/12 flex flex-row justify-end items-center py-2'>
                    <FaBell className='font-mono text-[#ccd8e8] mx-1 text-base' />
                    <div className='font-mono text-[#9199a8] mx-1 text-sm'>Notifications</div>
                </div>
                <div className='w-11/12 text-start font-mono font-bold text-2xl py-2 text-[#02166c]'>Home</div>
                <div className='flex flex-col items-center sm:items-start sm:flex-row w-11/12 h-full overflow-auto'>
                    <div className="w-11/12 sm:w-2/3 flex flex-col items-center flex-grow overflow-auto">
                        <div className="bg-gray-50 rounded-lg w-full flex flex-col items-center">
                            <div className="relative w-full h-40 rounded-lg bg-gray-200 shadow-lg">
                                <img className="w-full h-full object-cover rounded-lg" src={User.cover_image || "/cover.png"} />
                                { 
                                    is_edit_state && (
                                        <>
                                            <Button onClick={updateCoverImage} Icon={FaCamera} bg_color={"bg-blue-500"} icon_color={"text-gray-50"} />
                                            <input onChange={onCoverImageChange} ref={cover_image} type='file' hidden />
                                        </>
                                    )
                                }
                            </div>
                            <div className="-mt-28 z-1 w-full flex flex-col items-center">
                                <div className="relative h-40 w-40 rounded-full bg-gray-100 shadow-lg border-gray-50 border-4">
                                    <img className="object-cover w-full h-full rounded-full" alt='profile_image' src={User.profile_image != null ? User.profile_image : '/profile.png'} />
                                    { 
                                        is_edit_state && (
                                            <>
                                                <Button onClick={updateProfileImage} Icon={FaCamera} bg_color={"bg-blue-500"} icon_color={"text-gray-50"} />
                                                <input onChange={onProfileImageChange} ref={profile_image} type='file' hidden />
                                            </>
                                        )
                                    }
                                </div>
                                {
                                    is_edit_state ? (
                                        <input className="font-mono text-lg font-semibold my-2 border-none outline-none bg-transparent text-center" type="text" placeholder="Username" onChange={(ev) => setUsername(ev.target.value)} value={username}/>
                                    ) : (
                                        <div className="font-mono text-lg font-semibold my-2">{User.username}</div>
                                    )
                                }
                                {
                                    is_edit_state ? (
                                        <input className="font-mono text-xs text-gray-300 border-none outline-none bg-transparent text-center" type="text" placeholder="Bio" onChange={(ev) => setBio(ev.target.value)} value={bio}/>
                                    ) : (
                                        <div className="font-mono text-xs text-gray-300">{User.bio}</div>
                                    )
                                }
                                
                            </div>
                            {
                                is_edit_state ? (
                                    <div className="w-full flex flex-row items-center justify-center my-4">
                                        <div onClick={cancelEdit} className="flex items-center px-8 py-1 rounded-lg text-xs font-medium bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-gray-50 cursor-pointer duration-300">Cancel</div>
                                        <div onClick={updateUser} className="flex items-center px-8 py-1 rounded-lg text-xs font-medium bg-blue-500 border-2 border-blue-500 text-gray-50 hover:bg-blue-500 hover:text-gray-50 cursor-pointer duration-300 ml-2">Save</div>
                                    </div>
                                ) : (
                                    <div className="w-full flex flex-row items-center justify-center my-4">
                                        <a href={"/user/"+User._id} className="flex items-center px-8 py-1 rounded-lg text-xs font-medium bg-gray-200 text-gray-600 hover:bg-gray-500 hover:text-gray-50 cursor-pointer duration-300"><FaEye className="mr-2"/> View profile</a>
                                        <div onClick={() => setIsEditState(true)} className="flex items-center px-8 py-1 rounded-lg text-xs font-medium bg-gray-200 text-gray-600 hover:bg-gray-500 hover:text-gray-50 cursor-pointer duration-300 ml-2"><FaEdit className="mr-2"/> Edit profile</div>
                                    </div>
                                )
                            }
                            <div className='w-full flex flex-row items-center my-8'>
                                <CardBox Icon={FaUsers} title={"Rooms"} value={User.rooms} color={"text-blue-500"} />
                                <CardBox Icon={FaUserFriends} title={"Friends"} value={User.friends} color={"text-blue-500"} />
                                <CardBox Icon={FaCalendar} title={"Joined at"} value={(new Date(User._createdAt)).toLocaleDateString()} color={"text-sky-400"} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const CardBox = ({ title, value, Icon=null, color }) => {
    return (
        <div className='flex-1 flex flex-col items-center hover:bg-gray-100 rounded-lg cursor-pointer'>
            {Icon && <Icon className="text-gray-400" />}
            <div className='text-xs text-gray-400 mb-2'>{title}</div>
            <div className={'text-lg font-medium '+color}>{value}</div>
        </div>
    )
}

const Button = ({ Icon, bg_color, icon_color, onClick }) => {
    return (
        <div onClick={onClick} className={'absolute z-0 bottom-0 right-0 p-2 rounded-full shadow-xl m-2 cursor-pointer hover:bg-blue-700 '+bg_color}>
            <Icon className={icon_color} />
        </div>
    )
}