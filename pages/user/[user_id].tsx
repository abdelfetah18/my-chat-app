import { FaCalendar, FaUserFriends, FaUsers } from "react-icons/fa";
import useUser from "../../libs/hooks/useUser";
import CardBox from "../../components/CardBox";

export default function UserProfile() {
    const { user } = useUser();

    return (
        <div className='flex flex-col sm:flex-row w-11/12 h-full overflow-auto'>
            <div className="w-full sm:w-2/3 flex flex-col items-center flex-grow overflow-auto">
                <div className="bg-gray-50 rounded-lg w-full flex flex-col items-center">
                    <div className="w-full h-40 rounded-lg bg-gray-200 shadow-lg">
                        <img alt="cover_image" className="w-full h-full object-cover rounded-lg" src={user.cover_image.url || "/cover.png"} />
                    </div>
                    <div className="-mt-28 z-1 w-full flex flex-col items-center">
                        <div className="h-40 w-40 rounded-full bg-gray-100 shadow-lg border-gray-50 border-4">
                            <img alt='profile_image' className="object-cover w-full h-full rounded-full" src={user.profile_image != null ? user.profile_image.url : '/profile.png'} />
                        </div>
                        <div className="font-mono text-lg font-semibold my-2">{user.username}</div>
                        <div className="font-mono text-xs text-gray-300">{user.bio}</div>
                    </div>
                    <div className='w-full flex flex-row items-center my-8'>
                        <CardBox Icon={FaUsers} title={"Rooms"} value={user.rooms.toString()} color={"#3b82f6"} />
                        <CardBox Icon={FaUserFriends} title={"Friends"} value={user.friends.toString()} color={"#3b82f6"} />
                        <CardBox Icon={FaCalendar} title={"Joined at"} value={(new Date(user._createdAt)).toLocaleDateString('en-us')} color={"#38bdf8"} />
                    </div>
                </div>
            </div>
        </div>
    )
}