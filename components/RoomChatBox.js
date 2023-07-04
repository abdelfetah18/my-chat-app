import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { FaLock, FaUsers, FaCalendar, FaGlobeAfrica, FaSignOutAlt, FaTimes, FaEdit, FaCamera } from 'react-icons/fa';
import SubmitButton from "../components/SubmitButton";

export default function RoomChatBox({ room: _room, User }){
    const [room, setRoom] = useState(_room);
    const [is_edit_state,setIsEditState] = useState(false);

    let [name,setName] = useState(room.name);
    let [bio,setBio] = useState(room.bio || "");

    let profile_image = useRef();
    let cover_image = useRef();

    async function leave(){
        let response = await axios.post('/api/v1/room/leave',{ room_id:room._id },{ headers:{ authorization:User.access_token } })
        let payload = response.data;
        payload.redirect = "/rooms";
        return payload;
    }

    async function delete_room(){
        let response = await axios.post('/api/v1/room/delete',{ room_id:room._id },{ headers:{ authorization:User.access_token } });
        let payload = response.data;
        payload.redirect = "/rooms";
        return payload;
    }

    function updateRoomProfileImage(){
        profile_image.current.click();
    }

    async function onRoomProfileImageChange(evt){
        let form = new FormData();
        form.append('profile_image', evt.target.files[0]);
        form.append('room_id', room._id);
        let response = await axios.post('/api/v1/room/upload_profile_image', form);
        setRoom(response.data.data);
    }

    function updateRoomCoverImage(){
        cover_image.current.click();
    }

    async function onRoomCoverImageChange(evt){
        let form = new FormData();
        form.append('cover_image', evt.target.files[0]);
        form.append('room_id', room._id);
        let response = await axios.post('/api/v1/room/upload_cover_image', form);
        setRoom(response.data.data);
        console.log({ response: response.data });
    }

    function is_admin(){
        return room.admin._id == User._id;
    }

    function cancelEdit(){
        setIsEditState(false);
        setName(room.name);
        setBio(room.bio);
    }

    async function updateRoom(){
        let response = await axios.post("/api/v1/room/update", { room_id: room._id, name, bio }, { headers:{ authorization:User.access_token } });
        if(response.data.status == "success"){
            setRoom(state => ({ ...state, name, bio }));
            setIsEditState(false);
        }
    }

    return(
        <div className='md:w-5/6 w-full flex flex-col lg:w-4/6 items-center h-full font-mono'>
            <div className='w-full pb-10 bg-gray-50 rounded-lg flex flex-col items-center'>
                <div className='w-full h-40 bg-gray-200 rounded-lg relative'>
                    <img src={room.cover_image || "/cover.png"} className='h-full w-full object-cover shadow-xl rounded-lg' />
                    {
                        is_admin() && is_edit_state && ( 
                            <>
                                <Button onClick={updateRoomCoverImage} Icon={FaCamera} bg_color={"bg-blue-500"} icon_color={"text-gray-50"} />
                                <input onChange={onRoomCoverImageChange} ref={cover_image} type='file' hidden />
                            </>
                        )
                    }
                </div>
                <div className='-mt-28 z-1 w-full flex flex-col items-center'>
                    <div className='relative h-40 w-40 rounded-full bg-gray-400 border-white border-4 shadow-xl'>
                        <img src={room.profile_image || "/profile.jpeg"} className='h-full w-full object-cover rounded-full shadow-xl' />
                        { 
                            is_admin() &&  is_edit_state && (
                                <>
                                    <Button onClick={updateRoomProfileImage} Icon={FaCamera} bg_color={"bg-blue-500"} icon_color={"text-gray-50"} />
                                    <input onChange={onRoomProfileImageChange} ref={profile_image} type='file' hidden />
                                </>
                            )
                        }
                    </div>
                    {
                        is_edit_state ? (
                            <>
                                <input className="font-mono font-semibold text-lg mt-4 border-none outline-none bg-transparent text-center" type="text" placeholder="Name" onChange={(ev) => setName(ev.target.value)} value={name} />
                                <input className="font-mono font-base text-sm text-gray-300 border-none outline-none bg-transparent text-center" type="text" placeholder="Bio" onChange={(ev) => setBio(ev.target.value)} value={bio} />
                            </>
                        ) : (
                            <>
                                <div className='font-mono font-semibold text-lg mt-4'>{room.name}</div>
                                <div className='font-mono font-base text-sm text-gray-300'>{room.bio}</div>
                            </>
                        )
                    }
                    

                    <div className='w-full flex flex-row items-center mt-8'>
                        <CardBox Icon={room.is_public ? FaGlobeAfrica : FaLock} title={"Privacy"} value={room.is_public ? "Public" : "Private"} color={room.is_public ? "text-green-500" : "text-red-500"} />
                        <CardBox Icon={FaUsers} title={"Total member"} value={room.total_members} color={"text-blue-500"} />
                        <CardBox Icon={FaCalendar} title={"Created at"} value={(new Date(room._createdAt)).toLocaleDateString()} color={"text-gray-500"} />
                    </div>
                    
                    {   room.username == undefined &&
                        (
                            is_admin() ? (
                                is_edit_state ? (
                                    <div className='w-full flex flex-row items-center justify-center mt-10'>
                                        <div onClick={cancelEdit} className='px-8 py-1 rounded-lg cursor-pointer hover:bg-blue-700 hover:border-blue-700 hover:text-gray-50 bg-transparent border-2 border-blue-500 text-blue-500 flex items-center'>Cancel</div>
                                        <div onClick={updateRoom} className='px-8 py-1 rounded-lg cursor-pointer hover:bg-blue-700 hover:border-blue-700 hover:text-gray-50 bg-blue-500 border-2 border-blue-500 text-gray-50 flex items-center ml-2'>Save</div>
                                    </div>
                                ) : (
                                    <div className='w-full flex flex-row items-center justify-center mt-10'>
                                        <div onClick={() => setIsEditState(true)} className='px-8 py-1 rounded-lg cursor-pointer hover:bg-blue-700 bg-blue-500 text-gray-50 flex items-center'><FaEdit className='mr-2' />Edit room</div>
                                        <SubmitButton onClick={delete_room} text={"Delete"} Icon={FaTimes} className='bg-red-500 text-gray-50' wrapperClassName="w-fit ml-2" />
                                    </div>
                                )
                            ) : (
                                <SubmitButton onClick={leave} text={"Leave"} Icon={FaSignOutAlt} className='bg-sky-500 text-gray-50' wrapperClassName="mt-10" />
                            )
                        )
                    }
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
            <div className={'text-xl font-semibold '+color}>{value}</div>
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