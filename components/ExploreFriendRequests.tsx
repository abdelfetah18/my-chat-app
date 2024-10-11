import SubmitButton, { SubmitButtonResult } from "./SubmitButton";
import { Friend } from "../domain/Friends";
import useFriendRequests from "../libs/hooks/useFriendRequests";

export default function ExploreFriendRequests() {
    const { friendRequests, acceptFriend, rejectFriend } = useFriendRequests();

    if (friendRequests.length == 0)
        return <></>

    return (
        <div className="w-full grid grid-cols-4 gap-6">
            {
                friendRequests.map((friendRequest: Friend, index: number) => <FriendRequest key={index} acceptFriend={acceptFriend} rejectFriend={rejectFriend} friend_request={friendRequest} />)
            }
        </div>
    )
}

const FriendRequest = function ({ friend_request, acceptFriend, rejectFriend }) {
    async function accept(): Promise<SubmitButtonResult> {
        await acceptFriend(friend_request._id);
        return { status: 'success' };
    }

    async function reject(): Promise<SubmitButtonResult> {
        await rejectFriend(friend_request._id);
        return { status: 'success' };
    }

    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-full flex flex-col bg-gray-100 border rounded-lg">
                <div className="w-full bg-gray-100 rounded-t-lg">
                    <img alt="profile_image" className="w-full h-full rounded-t-lg" src={friend_request.inviter.profile_image != null ? friend_request.inviter.profile_image.url + "?h=400&w=400&fit=crop&crop=center" : "/profile.png"} />
                </div>
                <div className="text-base px-2">{friend_request.inviter.username}</div>
                <div className="w-full px-1 my-2">
                    <SubmitButton key={crypto.randomUUID()} onClick={accept} text={"Accept"} className="flex items-center rounded-lg border border-primaryColor bg-primaryColor text-white py-1 text-sm w-full justify-center cursor-pointer active:scale-105 duration-300 hover:bg-secondaryColor hover:border-secondaryColor" />
                    <SubmitButton key={crypto.randomUUID()} onClick={reject} text={"Reject"} className="flex items-center rounded-lg w-full justify-center text-sm border border-primaryColor text-primaryColor py-1 mt-1 cursor-pointer active:scale-105 duration-300 hover:bg-secondaryColor hover:border-secondaryColor hover:text-white" />
                </div>
            </div>
        </div>
    )
}