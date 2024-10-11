import { FaRegComment } from "react-icons/fa";
import { Friend } from "../domain/Friends";
import useAllFriends from "../libs/hooks/useAllFriends";
import Link from "next/link";
import { User } from "../domain/Users";
import { useContext } from "react";
import UserSessionContext from "../libs/contexts/UserSessionContext";

export default function AllFriends() {
    const { friends } = useAllFriends();

    if (friends.length == 0)
        return <>No Friends</>

    return (
        <div className="w-full grid grid-cols-4 gap-6">
            {
                friends.map((friend: Friend, index: number) => <FriendCard key={index} friend={friend} />)
            }
        </div>
    )
}

const FriendCard = function ({ friend }: { friend: Friend }) {
    const userSession = useContext(UserSessionContext);
    const inviter = friend.inviter as User;
    const user = friend.user as User;
    const username = userSession.user_id == user._id ? inviter.username : user.username;
    const profileImageURL = userSession.user_id == user._id ? (
        inviter.profile_image != null ? inviter.profile_image.url + "?h=400&w=400&fit=crop&crop=center" : "/profile.png"
    ) : (
        user.profile_image != null ? user.profile_image.url + "?h=400&w=400&fit=crop&crop=center" : "/profile.png"
    )

    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-full flex flex-col bg-gray-100 border rounded-lg">
                <div className="w-full bg-gray-100 rounded-t-lg">
                    <img alt="profile_image" className="w-full h-full rounded-t-lg" src={profileImageURL} />
                </div>
                <div className="text-base px-2">{username}</div>
                <div className="w-full px-1 my-2">
                    <Link href={`/chat/${friend.chat._id}`} className='w-full justify-center px-12 py-2 text-sm rounded-full cursor-pointer duration-300 hover:text-white hover:bg-purple-700 bg-gray-200 text-gray-700 flex items-center'><FaRegComment className='mr-2' />Open Chat</Link>
                </div>
            </div>
        </div>
    )
}