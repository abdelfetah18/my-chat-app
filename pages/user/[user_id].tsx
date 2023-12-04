import { FaBell, FaCalendar, FaEdit, FaEye, FaUserFriends, FaUsers } from "react-icons/fa";
import Navigation from "../../components/Navigation";
import { useState } from "react";
import SubmitButton from "../../components/SubmitButton";
import { getUser } from "../../database/client";

export async function getServerSideProps({ req, params }) {
    let { user_id } = params;
    let user = await getUser(user_id);

    if(!user)
        return {
            redirect: {
                permanent: false,
                destination: "/"
            },
            props:{},
        };

    return { props: { user, } }
}

export default function UserProfile({ user }){
    let [User,setUser] = useState(user);

    return(
        <div className='flex flex-col sm:flex-row background h-screen w-screen'>
            <Navigation page={'/'} />
            <div className='h-full lg:w-5/6 md:w-11/12 w-full bg-[#f1f5fe] sm:rounded-l-3xl flex flex-col px-10 py-4'>
                <div className='w-full flex flex-row justify-end items-center py-2'>
                    <FaBell className='font-mono text-[#ccd8e8] mx-1 text-base' />
                    <div className='font-mono text-[#9199a8] mx-1 text-sm'>Notifications</div>
                </div>
                <div className='w-full text-start font-mono font-bold text-2xl py-2 text-[#02166c]'>User profile</div>
                <div className='flex flex-col sm:flex-row w-full h-full overflow-auto'>
                    <div className="w-full sm:w-2/3 flex flex-col items-center flex-grow overflow-auto">
                        <div className="bg-gray-50 rounded-lg w-full flex flex-col items-center">
                            <div className="w-full h-40 rounded-lg bg-gray-200 shadow-lg">
                                <img className="w-full h-full object-cover rounded-lg" src={User.cover_image || "/cover.png"} />
                            </div>
                            <div className="-mt-28 z-1 w-full flex flex-col items-center">
                                <div className="h-40 w-40 rounded-full bg-gray-100 shadow-lg border-gray-50 border-4">
                                    <img className="object-cover w-full h-full rounded-full" alt='profile_image' src={User.profile_image != null ? User.profile_image : '/profile.png'} />
                                </div>
                                <div className="font-mono text-lg font-semibold my-2">{User.username}</div>
                                <div className="font-mono text-xs text-gray-300">{User.bio}</div>
                            </div>
                            <div className='w-full flex flex-row items-center my-8'>
                                <CardBox Icon={FaUsers} title={"Rooms"} value={User.rooms} color={"text-blue-500"} />
                                <CardBox Icon={FaUserFriends} title={"Friends"} value={User.friends} color={"text-blue-500"} />
                                <CardBox Icon={FaCalendar} title={"Joined at"} value={(new Date(User._createdAt)).toLocaleDateString('en-us')} color={"text-sky-400"} />
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