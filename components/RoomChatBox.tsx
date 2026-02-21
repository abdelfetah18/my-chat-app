import { useContext, useEffect } from 'react';
import { FaSignOutAlt, FaRegComment, FaCog } from 'react-icons/fa';
import SubmitButton, { SubmitButtonResult } from "../components/SubmitButton";
import useRoom from '../libs/hooks/useRoom';
import { useRouter } from 'next/router';
import { User } from '../domain/Users';
import Link from 'next/link';
import { Chat } from '../domain/Chats';
import useModal from '../libs/hooks/useModal';
import Modal from './Modal';
import UserSessionContext from '../libs/contexts/UserSessionContext';
import RoomSettings from './RoomSettings';

export default function RoomChatBox() {
    const userSession = useContext(UserSessionContext);
    const useModalValue = useModal();
    const router = useRouter();
    const { room, members, resetRoom, leaveRoom } = useRoom(router.query.room_id as string);
    const chat = room.chat as Chat;



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

    function is_admin(): boolean {
        const memberIndex = members.findIndex(member => (member.user as User)._id == userSession.user_id);
        if (memberIndex == -1) {
            return false;
        }

        return members[memberIndex].role == "admin";
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
                                    <div onClick={() => useModalValue.open()} className='w-fit justify-center px-12 py-2 text-sm rounded-full cursor-pointer duration-300 hover:text-white hover:bg-purple-700 bg-gray-200 text-gray-700 flex items-center'><FaCog className='mr-2' />Room Settings</div>
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
            <Modal animationName='FadeIn' useModal={useModalValue} title="Room Settings" description="Manage this room's preferences and options.">
                <RoomSettings roomId={room._id} />
            </Modal>
        </div>
    )
}