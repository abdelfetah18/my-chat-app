import { FaCalendar, FaUserFriends, FaUsers } from "react-icons/fa";
import useUser from "../../libs/hooks/useUser";
import CardBox from "../../components/CardBox";

export default function UserProfile() {
    const { user } = useUser();

    return (
        <div className='w-full flex flex-col items-center overflow-auto p-4'>
            <div className="w-full flex flex-col items-center flex-grow overflow-auto">
                <div className="bg-gray-50 rounded-3xl w-full flex flex-col items-center">
                    <div className="relative w-full rounded-t-3xl bg-gray-200">
                        <img alt="cover_image" className="w-full aspect-[4/1] object-cover rounded-t-3xl" src={user.cover_image?.url || "/cover.png"} />
                    </div>
                    <div className="-mt-28 z-1 w-full flex flex-col items-center">
                        <div className="relative h-40 w-40 rounded-full bg-gray-100 border-gray-50 border-4">
                            <img alt="profile_image" className="object-cover w-full h-full rounded-full" src={user.profile_image?.url || '/profile.png'} />
                        </div>
                        <div className="text-xl text-black font-semibold my-2">{user.username}</div>
                        <div className="text-sm text-gray-400">{user.bio}</div>
                    </div>
                    {/* <div className="w-full flex flex-row items-center justify-center my-4">
                        <a href={"/user/" + user._id} className="w-fit justify-center flex items-center px-8 py-2 rounded-lg text-xs font-medium bg-gray-200 text-gray-600 hover:bg-primaryColor hover:text-white cursor-pointer duration-300"><FaRegComment className="mr-2" />Open Chat</a>
                        <Link href={"/settings"} className="w-fit justify-center flex items-center px-8 py-2 rounded-lg text-xs font-medium bg-gray-200 text-gray-600 hover:bg-primaryColor hover:text-white cursor-pointer duration-300 ml-2"><FaEdit className="mr-2" /> Edit Profile</Link>
                    </div> */}

                    <div className='w-full flex flex-row items-center my-8'>
                        <CardBox Icon={FaUsers} title={"Rooms"} value={user.rooms.toString()} textColor='#999' iconColor='#999' />
                        <CardBox Icon={FaUserFriends} title={"Friends"} value={user.friends.toString()} textColor='#999' iconColor='#999' />
                        <CardBox Icon={FaCalendar} title={"Joined at"} value={(new Date(user._createdAt)).toLocaleDateString('en-us')} textColor='#999' iconColor='#999' />
                    </div>
                </div>
            </div>
        </div>
    )
}