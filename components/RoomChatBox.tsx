import { ChangeEvent, useContext, useRef, useState } from 'react';
import { FaLock, FaUsers, FaCalendar, FaGlobeAfrica, FaSignOutAlt, FaTimes, FaEdit, FaCamera } from 'react-icons/fa';
import SubmitButton, { SubmitButtonResult } from "../components/SubmitButton";
import useRoom from '../libs/hooks/useRoom';
import { useRouter } from 'next/router';
import { User } from '../domain/Users';
import UserSessionContext from '../libs/contexts/UserSessionContext';
import CardBox from './CardBox';

export default function RoomChatBox() {
    const userSession = useContext(UserSessionContext);
    const router = useRouter();
    const { room, setRoom, resetRoom, leaveRoom, deleteRoom, updateRoom, upload_profile_image, upload_cover_image } = useRoom(router.query.room_id as string);
    const [is_edit_state, setIsEditState] = useState(false);

    let profile_image = useRef<HTMLInputElement>(null);
    let cover_image = useRef<HTMLInputElement>(null);

    async function leave(): Promise<SubmitButtonResult> {
        await leaveRoom();
        setTimeout(() => { window.location.href = "/rooms"; }, 1000);
        return { status: 'success' };
    }

    async function delete_room(): Promise<SubmitButtonResult> {
        await deleteRoom();
        setTimeout(() => { window.location.href = "/rooms"; }, 1000);
        return { status: 'success' };
    }

    function updateRoomProfileImage() {
        profile_image.current.click();
    }

    async function onRoomProfileImageChange(evt: ChangeEvent<HTMLInputElement>) {
        let asset = await upload_profile_image(room._id, evt.target.files[0]);
        setRoom(state => ({ ...state, profile_image: asset }));
    }

    function updateRoomCoverImage() {
        cover_image.current.click();
    }

    async function onRoomCoverImageChange(evt: ChangeEvent<HTMLInputElement>) {
        let asset = await upload_cover_image(room._id, evt.target.files[0]);
        setRoom(state => ({ ...state, cover_image: asset }));
    }

    function is_admin(): boolean {
        return (room.admin as User)._id == userSession.user_id;
    }

    function cancelEdit() {
        setIsEditState(false);
        resetRoom();
    }

    async function update() {
        await updateRoom();
        setIsEditState(false);
    }

    return (
        <div className={`md:w-5/6 w-full flex flex-col items-center h-full font-mono ${room._id ? "flex" : "hidden"}`}>
            <div className='w-full pb-10 bg-gray-50 rounded-lg flex flex-col items-center'>
                <div className='w-full h-40 bg-gray-200 rounded-lg relative'>
                    <img alt="cover_image" src={room.cover_image?.url || "/cover.png"} className='h-full w-full object-cover shadow-xl rounded-lg' />
                    {
                        is_admin() && is_edit_state && (
                            <>
                                <Button onClick={updateRoomCoverImage} Icon={FaCamera} bg_color={"bg-purple-500"} icon_color={"text-purple-50"} />
                                <input onChange={onRoomCoverImageChange} ref={cover_image} type='file' hidden />
                            </>
                        )
                    }
                </div>
                <div className='-mt-28 z-1 w-full flex flex-col items-center'>
                    <div className='relative h-40 w-40 rounded-full bg-purple-400 border-white border-4 shadow-xl'>
                        <img alt="profile_image" src={room.profile_image?.url || "/profile.png"} className='h-full w-full object-cover rounded-full shadow-xl' />
                        {
                            is_admin() && is_edit_state && (
                                <>
                                    <Button onClick={updateRoomProfileImage} Icon={FaCamera} bg_color={"bg-purple-500"} icon_color={"text-purple-50"} />
                                    <input onChange={onRoomProfileImageChange} ref={profile_image} type='file' hidden />
                                </>
                            )
                        }
                    </div>
                    {
                        is_edit_state ? (
                            <>
                                <input className="font-mono font-semibold text-lg mt-4 border-none outline-none bg-transparent text-center text-purple-700 placeholder:text-purple-300" type="text" placeholder="Name" onChange={(ev) => setRoom(state => ({ ...state, name: ev.target.value }))} value={room.name} />
                                <input className="font-mono font-base text-sm text-purple-300 border-none outline-none bg-transparent text-center placeholder:text-purple-300" type="text" placeholder="Bio" onChange={(ev) => setRoom(state => ({ ...state, bio: ev.target.value }))} value={room.bio} />
                            </>
                        ) : (
                            <>
                                <div className='font-mono font-semibold text-lg mt-4 text-purple-800'>{room.name}</div>
                                <div className='font-mono font-base text-sm text-purple-300'>{room.bio}</div>
                            </>
                        )
                    }


                    <div className='w-full flex flex-row items-center mt-8'>
                        <CardBox Icon={room.is_public ? FaGlobeAfrica : FaLock} title={"Privacy"} value={room.is_public ? "Public" : "Private"} textColor='#c084fc' iconColor='#c4b5fd' />
                        <CardBox Icon={FaUsers} title={"Total member"} value={room.total_members.toString()} textColor='#c084fc' iconColor='#c4b5fd' />
                        <CardBox Icon={FaCalendar} title={"Created at"} value={(new Date(room._createdAt)).toLocaleDateString('en-us')} textColor='#c084fc' iconColor='#c4b5fd' />
                    </div>

                    {
                        router.query.room_id && (
                            is_admin() ? (
                                is_edit_state ? (
                                    <div className='w-full flex flex-row items-center justify-center mt-10'>
                                        <div onClick={cancelEdit} className='px-8 py-2 rounded-lg cursor-pointer hover:bg-purple-700 hover:border-purple-700 hover:text-purple-50 bg-transparent border-2 border-purple-500 text-purple-500 flex items-center'>Cancel</div>
                                        <div onClick={update} className='px-8 py-2 rounded-lg cursor-pointer hover:bg-purple-700 hover:border-purple-700 hover:text-purple-50 bg-purple-500 border-2 border-purple-500 text-purple-50 flex items-center ml-2'>Save</div>
                                    </div>
                                ) : (
                                    <div className='w-full flex flex-col sm:flex-row items-center justify-center mt-10'>
                                        <div onClick={() => setIsEditState(true)} className='sm:mb-0 mb-2 sm:w-fit w-11/12 justify-center px-8 py-1 rounded-lg cursor-pointer hover:bg-purple-700 bg-purple-400 text-purple-50 flex items-center'><FaEdit className='mr-2' />Edit room</div>
                                        <SubmitButton key={crypto.randomUUID()} onClick={delete_room} text={"Delete"} Icon={FaTimes} className='bg-purple-400 text-purple-50 py-2 w-11/12 justify-center sm:w-fit' wrapperClassName="w-full sm:w-fit sm:ml-2" />
                                    </div>
                                )
                            ) : (
                                <SubmitButton key={crypto.randomUUID()} onClick={leave} text={"Leave"} Icon={FaSignOutAlt} className='bg-purple-500 hover:bg-purple-600 text-purple-50 py-2' wrapperClassName="mt-10" />
                            )
                        )
                    }
                </div>
            </div>
        </div>
    )
}


const Button = ({ Icon, bg_color, icon_color, onClick }) => {
    return (
        <div onClick={onClick} className={'absolute z-0 bottom-0 right-0 p-2 rounded-full shadow-xl m-2 cursor-pointer hover:bg-blue-700 ' + bg_color}>
            <Icon className={icon_color} />
        </div>
    )
}