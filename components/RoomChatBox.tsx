import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import { FaSignOutAlt, FaEdit, FaRegComment, FaImage } from 'react-icons/fa';
import SubmitButton, { SubmitButtonResult } from "../components/SubmitButton";
import useRoom from '../libs/hooks/useRoom';
import { useRouter } from 'next/router';
import { User } from '../domain/Users';
import Link from 'next/link';
import { Chat } from '../domain/Chats';
import useModal from '../libs/hooks/useModal';
import Modal from './Modal';
import UserSessionContext from '../libs/contexts/UserSessionContext';
import Loading from './Loading';
import ToastContext from '../libs/contexts/ToastContext';

export default function RoomChatBox() {
    const [isLoading, setIsLoading] = useState(false);
    const toastManager = useContext(ToastContext);
    const userSession = useContext(UserSessionContext);
    const useModalValue = useModal();
    const router = useRouter();
    const { room, members, setRoom, resetRoom, leaveRoom, updateRoom, upload_profile_image, upload_cover_image } = useRoom(router.query.room_id as string);
    const profileImageInputRef = useRef<HTMLInputElement>(null);
    const coverImageInputRef = useRef<HTMLInputElement>(null);
    const chat = room.chat as Chat;

    function readProfileImageURL(input: HTMLInputElement): void {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                setRoom(state => ({ ...state, profile_image: { url: e.target.result.toString() } }));
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    function readCoverImageURL(input: HTMLInputElement): void {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                setRoom(state => ({ ...state, cover_image: { url: e.target.result.toString() } }));
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    function onSelectProfileImage(ev: ChangeEvent<HTMLInputElement>): void {
        readProfileImageURL(ev.target);
    }

    function onSelectCoverImage(ev: ChangeEvent<HTMLInputElement>): void {
        readCoverImageURL(ev.target);
    }

    useEffect(() => {
        if (!useModalValue.isOpen) {
            resetRoom();
        }
    }, [useModalValue.isOpen]);


    async function leave(): Promise<SubmitButtonResult> {
        await leaveRoom();
        setTimeout(() => { window.location.href = "/rooms"; }, 1000);
        return { status: 'success' };
    }

    // async function delete_room(): Promise<SubmitButtonResult> {
    //     await deleteRoom();
    //     setTimeout(() => { window.location.href = "/rooms"; }, 1000);
    //     return { status: 'success' };
    // }

    function is_admin(): boolean {
        const memberIndex = members.findIndex(member => (member.user as User)._id == userSession.user_id);
        if (memberIndex == -1) {
            return false;
        }

        return members[memberIndex].role == "admin";
    }

    async function updateRoomHandler(): Promise<void> {
        setIsLoading(true);

        if (profileImageInputRef.current.value.length > 0) {
            await upload_profile_image(room?._id || "", profileImageInputRef.current.files[0])
        }

        if (coverImageInputRef.current.value.length > 0) {
            await upload_cover_image(room?._id || "", coverImageInputRef.current.files[0])
        }

        const updatedRoom = await updateRoom();
        if (updatedRoom) {
            toastManager.alertSuccess("Room updated successfully.");
            useModalValue.close();
        } else {
            toastManager.alertError("Something went wrong.");
        }

        setIsLoading(false);
    }

    return (
        <div className={"w-2/3 bg-white m-2 rounded-3xl shadow-xl flex flex-col items-center"}>
            <div className='w-full pb-10 bg-gray-50 rounded-lg flex flex-col items-center'>
                <div className='w-full bg-gray-200 rounded-t-lg relative aspect-[4/1] overflow-hidden'>
                    <img alt="cover_image" src={room.cover_image?.url || "/cover.png"} className='h-full w-full object-cover aspect-[4/1]' />
                </div>
                <div className='-mt-16 z-1 w-full flex flex-col items-center'>
                    <div className='relative h-32 w-32 rounded-full bg-purple-400 border-white border-4'>
                        <img alt="profile_image" src={room.profile_image?.url || "/profile.png"} className='h-full w-full aspect-square object-cover rounded-full' />
                    </div>

                    <div className='font-semibold text-base text-black'>{room.name}</div>
                    <div className='text-xs text-gray-400'>{room.bio}</div>

                    {
                        router.query.room_id && (
                            <div className='w-full flex gap-2 flex-row items-center justify-center mt-6'>
                                {is_admin() ? (
                                    <div onClick={() => useModalValue.open()} className='w-fit justify-center px-12 py-2 text-sm rounded-full cursor-pointer duration-300 hover:text-white hover:bg-purple-700 bg-gray-200 text-gray-700 flex items-center'><FaEdit className='mr-2' />Edit Profile</div>
                                ) : (
                                    <SubmitButton key={crypto.randomUUID()} onClick={leave} text={"Leave"} Icon={FaSignOutAlt} className='w-fit justify-center px-12 py-2 text-sm rounded-full cursor-pointer duration-300 hover:text-white hover:bg-primaryColor bg-gray-200 text-gray-700 flex items-center' />
                                )}
                                <Link href={`/chat/${chat?._id}`} className='w-fit justify-center px-12 py-2 text-sm rounded-full cursor-pointer duration-300 hover:text-white hover:bg-purple-700 bg-gray-200 text-gray-700 flex items-center'><FaRegComment className='mr-2' />Open Chat</Link>
                            </div>
                        )
                    }

                    <div className='w-full px-2 flex items-center mt-8'>
                        <div className='flex-grow h-px bg-gray-200'></div>
                    </div>
                    <div className='w-full px-2 flex flex-col'>
                        <div className='w-full flex flex-col'>
                            <div className='flex items-center'>
                                <div className='text-black text-sm px-4 py-2 border-b-2 border-primaryColor'>Members</div>
                            </div>
                        </div>
                        <div className='w-full bg-gray-100 grid grid-cols-2 gap-2 p-3'>
                            {
                                members.map((member, index) => {
                                    const user = member.user as User;

                                    return (
                                        <div key={index} className='flex items-center gap-2 p-2 border rounded-xl'>
                                            <div className='h-10 w-10 bg-gray-200 rounded-lg'>
                                                <img alt="profile_image" src={user.profile_image?.url || "/profile.png"} className='h-full w-full object-cover rounded-full' />
                                            </div>
                                            <div className='flex flex-col'>
                                                <div className='text-sm'>{user.username}</div>
                                                <div className='text-gray-400 text-xs'>{member.role}</div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
            <Modal useModal={useModalValue}>
                <div className='w-1/2 flex flex-col bg-white p-4 rounded-xl'>
                    <div className='w-full flex flex-col relative'>
                        <input ref={profileImageInputRef} onChange={onSelectProfileImage} accept='image/*' type='file' hidden />
                        <input ref={coverImageInputRef} onChange={onSelectCoverImage} accept='image/*' type='file' hidden />
                        <div className='w-full aspect-[4/1] bg-gray-200 rounded-xl relative'>
                            <img src={(room.cover_image ? room.cover_image.url : '/cover.png')} className='absolute top-0 left-0 w-full h-full object-cover rounded-xl' />
                            <div onClick={() => coverImageInputRef.current.click()} className='absolute bottom-2 right-2 bg-secondaryColor text-white px-8 py-1 text-sm rounded-full flex items-center gap-2 cursor-pointer active:scale-105 duration-300 select-none hover:bg-primaryColor'>
                                <FaImage />
                                <span>Cover Image</span>
                            </div>
                        </div>
                        <div className='absolute left-1/2 -translate-x-1/2 bottom-0 h-28 w-28 bg-gray-300 rounded-full'>
                            <div className='w-full h-full relative'>
                                <img src={(room.profile_image ? room.profile_image.url : '/profile.png')} className='absolute top-0 left-0 w-full h-full rounded-full object-cover' />
                                <div onClick={() => profileImageInputRef.current.click()} className='absolute bottom-1 right-1 bg-secondaryColor text-white p-2 text-sm rounded-full flex items-center gap-2 cursor-pointer active:scale-105 duration-300 select-none hover:bg-primaryColor'>
                                    <FaImage />
                                </div>
                            </div>
                        </div>
                        <div className='h-8 w-full'></div>
                    </div>
                    <div className='w-full flex flex-col gap-2 mt-4'>
                        <input value={room.name} onChange={(ev) => setRoom(state => ({ ...state, name: ev.target.value }))} className='bg-gray-100 rounded-full py-2 px-4 text-sm outline-none' type='text' placeholder='Enter Name' />
                        <textarea value={room.bio} onChange={(ev) => setRoom(state => ({ ...state, bio: ev.target.value }))} className='bg-gray-100 rounded-xl py-2 px-4 text-sm outline-none' placeholder='Enter Description or bio' rows={6} />
                    </div>
                    <div className='w-full flex flex-col gap-4 mt-4'>
                        <select value={room.is_public ? "public" : "private"} onChange={(ev) => setRoom(state => ({ ...state, is_public: ev.target.value == "public" }))} className='bg-gray-100 rounded-full py-2 px-4 text-sm border-r-8 border-r-gray-100 outline-none'>
                            <option disabled>Select Visibility</option>
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </select>
                        {
                            !room.is_public && (
                                <div className='w-full flex flex-col gap-2'>
                                    <div className='text-sm w-full'>Password:</div>
                                    <input value={room.is_public ? "" : room.password} onChange={(ev) => setRoom(state => ({ ...state, password: ev.target.value }))} className={`w-full bg-gray-100 rounded-full py-2 px-4 text-sm outline-none ${room.is_public ? "opacity-80 placeholder:text-gray-300" : ""}`} type='password' placeholder={room.is_public ? "Public Rooms Don't have a Password" : "Enter Password"} disabled={room.is_public} />
                                </div>
                            )
                        }
                    </div>
                    <div className='w-full flex flex-col items-center mt-8'>
                        <div onClick={updateRoomHandler} className='bg-primaryColor rounded-full text-white font-semibold text-center py-1 px-16 w-fit cursor-pointer hover:bg-secondaryColor active:scale-105 select-none duration-300'>Update</div>
                    </div>
                </div>
            </Modal>
            {
                isLoading && (
                    <Loading />
                )
            }
        </div>
    )
}