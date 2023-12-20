import { FaCalendar, FaUsers, FaUserFriends, FaEdit, FaEye, FaCamera } from 'react-icons/fa';
import { ChangeEvent, useState } from "react";
import React, { useRef } from "react";
import useUser from "../libs/hooks/useUser";
import CardBox from '../components/CardBox';
import Button from '../components/Button';

export default function Home() {
    const { user, setUser, resetUser, updateUser, upload_cover_image, upload_profile_image } = useUser();
    let [is_edit_state, setIsEditState] = useState(false);
    let profile_image = useRef<HTMLInputElement>(null);
    let cover_image = useRef<HTMLInputElement>(null);

    function cancelEdit() {
        setIsEditState(false);
        resetUser();
    }

    async function save(){
        await updateUser();
        setIsEditState(false);
    }

    function updateProfileImage() {
        if (profile_image.current) {
            profile_image.current.click();
        }
    }

    function updateCoverImage() {
        if (profile_image.current) {
            cover_image.current.click();
        }
    }

    async function onProfileImageChange(evt: ChangeEvent) {
        if (evt.target instanceof HTMLInputElement) {
            await upload_profile_image(evt.target.files[0]);
        }
    }

    async function onCoverImageChange(evt: ChangeEvent) {
        if (evt.target instanceof HTMLInputElement) {
            await upload_cover_image(evt.target.files[0]);
        }
    }

    return (
        <div className='flex flex-col items-center sm:items-start sm:flex-row w-11/12 h-full overflow-auto'>
            <div className="w-full sm:w-2/3 flex flex-col items-center flex-grow overflow-auto">
                <div className="bg-gray-50 rounded-lg w-full flex flex-col items-center">
                    <div className="relative w-full h-40 rounded-lg bg-gray-200 shadow-lg">
                        <img alt="cover_image" className="w-full h-full object-cover rounded-lg" src={user.cover_image?.url || "/cover.png"} />
                        {
                            is_edit_state && (
                                <>
                                    <Button onClick={updateCoverImage} Icon={FaCamera} bg_color={"#9333ea"} icon_color={"#f9fafb"} />
                                    <input onChange={onCoverImageChange} ref={cover_image} type='file' hidden />
                                </>
                            )
                        }
                    </div>
                    <div className="-mt-28 z-1 w-full flex flex-col items-center">
                        <div className="relative h-40 w-40 rounded-full bg-gray-100 shadow-lg border-gray-50 border-4">
                            <img alt="profile_image" className="object-cover w-full h-full rounded-full" src={user.profile_image?.url || '/profile.png'} />
                            {
                                is_edit_state && (
                                    <>
                                        <Button onClick={updateProfileImage} Icon={FaCamera} bg_color={"#9333ea"} icon_color={"#f9fafb"} />
                                        <input onChange={onProfileImageChange} ref={profile_image} type='file' hidden />
                                    </>
                                )
                            }
                        </div>
                        {
                            is_edit_state ? (
                                <input className="font-mono text-lg text-purple-900 placeholder:text-purple-200 font-semibold my-2 border-none outline-none bg-transparent text-center" type="text" placeholder="Username" onChange={(ev) => setUser(state => { return { ...state, username: ev.target.value }; })} value={user.username} />
                            ) : (
                                <div className="font-mono text-lg text-purple-900 font-semibold my-2">{user.username}</div>
                            )
                        }
                        {
                            is_edit_state ? (
                                <input className="font-mono text-xs text-purple-300 placeholder:text-purple-200 border-none outline-none bg-transparent text-center" type="text" placeholder="Bio" onChange={(ev) => setUser(state => { return { ...state, bio: ev.target.value }; })} value={user.bio} />
                            ) : (
                                <div className="font-mono text-xs text-purple-300">{user.bio}</div>
                            )
                        }

                    </div>
                    {
                        is_edit_state ? (
                            <div className="w-full flex flex-row items-center justify-center my-4">
                                <div onClick={cancelEdit} className="flex items-center px-8 py-2 rounded-lg text-xs font-medium bg-transparent border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-purple-50 cursor-pointer duration-300">Cancel</div>
                                <div onClick={save} className="flex items-center px-8 py-2 rounded-lg text-xs font-medium bg-purple-500 border-2 border-purple-500 text-purple-50 hover:bg-purple-500 hover:text-purple-50 cursor-pointer duration-300 ml-2">Save</div>
                            </div>
                        ) : (
                            <div className="w-full flex flex-col sm:flex-row items-center justify-center my-4">
                                <a href={"/user/" + user._id} className="mb-2 sm:mb-0 w-11/12 sm:w-fit justify-center flex items-center px-8 py-2 rounded-lg text-xs font-medium bg-purple-200 text-purple-400 hover:bg-purple-500 hover:text-purple-50 cursor-pointer duration-300"><FaEye className="mr-2" />View Profile</a>
                                <div onClick={() => setIsEditState(true)} className="w-11/12 sm:w-fit justify-center flex items-center px-8 py-2 rounded-lg text-xs font-medium bg-purple-200 text-purple-400 hover:bg-purple-500 hover:text-purple-50 cursor-pointer duration-300 sm:ml-2"><FaEdit className="mr-2" /> Edit Profile</div>
                            </div>
                        )
                    }
                    <div className='w-full flex flex-row items-center my-8'>
                        <CardBox Icon={FaUsers} title={"Rooms"} value={user.rooms.toString()} textColor='#c084fc' iconColor='#c4b5fd' />
                        <CardBox Icon={FaUserFriends} title={"Friends"} value={user.friends.toString()} textColor='#c084fc' iconColor='#c4b5fd' />
                        <CardBox Icon={FaCalendar} title={"Joined at"} value={(new Date(user._createdAt)).toLocaleDateString('en-us')} textColor='#c084fc' iconColor='#c4b5fd' />
                    </div>
                </div>
            </div>
        </div>
    )
}
