import SubmitButton, { SubmitButtonResult } from "./SubmitButton";
import { Friend } from "../domain/Friends";
import useFriendRequests from "../libs/hooks/useFriendRequests";

export default function ExploreFriendRequests() {
    const { friendRequests, acceptFriend, rejectFriend } = useFriendRequests();

    if (friendRequests.length == 0)
        return <></>

    return (
        <div className="w-11/12 flex flex-col my-2 sm:my-0">
            <div className="font-mono text-base sm:text-lg font-semibold">Friends requests:</div>
            <div className="w-full flex flex-col">
                <div className="flex flex-row w-full py-2">
                    {
                        friendRequests.map((friendRequest: Friend, index: number) => <FriendRequest key={index} acceptFriend={acceptFriend} rejectFriend={rejectFriend} friend_request={friendRequest} />)
                    }
                </div>
            </div>
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
        <div className="lg:w-1/6 md:w-1/4 w-full flex flex-col items-center my-1">
            <div className="w-11/12 flex flex-col items-center my-1 bg-gray-50 shadow-lg rounded-lg">
                <div className="w-full bg-gray-100 rounded-t-lg shadow">
                    <img alt="profile_image" className="w-full h-full rounded-t-lg" src={friend_request.inviter.profile_image != null ? friend_request.inviter.profile_image.url + "?h=400&w=400&fit=crop&crop=center" : "/profile.png"} />
                </div>
                <div className="font-mono font-semibold text-sm flex-grow w-full px-4 my-4">{friend_request.inviter.username}</div>
                <div className="w-full px-2 mb-2">
                    <SubmitButton key={crypto.randomUUID()} wrapperClassName={''} onClick={accept} text={"ACCEPT"} className="w-full justify-center font-mono font-semibold text-sm bg-blue-500 border-2 border-blue-500 text-white py-px" />
                    <SubmitButton key={crypto.randomUUID()} wrapperClassName={''} onClick={reject} text={"REJECT"} className="w-full justify-center font-mono font-semibold text-sm border-2 border-blue-500 text-blue-500 py-px mt-1" />
                </div>
            </div>
        </div>
    )
}