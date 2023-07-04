import axios from "axios";
import SubmitButton from "./SubmitButton";

export default function ExploreFriendRequests({ FriendRequests, User, updateContent }){
    if(FriendRequests.length == 0)
        return <></>

    return(
        <div className="w-11/12 flex flex-col my-2 sm:my-0">
            <div className="font-mono text-base sm:text-lg font-semibold">Friends requests:</div>
            <div className="w-full flex flex-col">
                <div className="flex flex-row w-full py-2">
                    {
                        FriendRequests.map((f, i) => <FriendRequest key={i} friend_request={f} User={User} updateContent={updateContent} />)
                    }
                </div>
            </div>
        </div>
    )
}

const FriendRequest = function ({ friend_request, User, updateContent }) {
    async function accept(){
        let response = await axios.post('/api/v1/user/accept',{ friend_id: friend_request._id },{ headers:{ authorization:User.access_token }});
        let payload = response.data;
        payload.callback = updateContent;
        return payload;
    }

    async function reject(){
        let response = await axios.post('/api/v1/user/reject',{ friend_id: friend_request._id },{ headers:{ authorization:User.access_token }});
        let payload = response.data;
        payload.callback = updateContent;
        return payload;
    }

    return (
        <div className="w-full flex flex-row items-center my-1 p-2 bg-gray-50 shadow-lg rounded-lg">
            <div className="w-10 h-10 bg-gray-100 rounded-full shadow">
                <img className="w-full h-full rounded-full" src={friend_request.inviter.profile_image != null ? friend_request.inviter.profile_image : "/profile.jpeg"} />
            </div>
            <div className="font-mono font-semibold text-sm flex-grow ml-2">{friend_request.inviter.username}</div>
            <div className="flex flex-col items-center">
                <SubmitButton onClick={accept} text={"Accept"} className="justify-center font-mono font-medium text-sm bg-blue-500 border-2 border-blue-500 text-white py-px" />
                <SubmitButton onClick={reject} text={"Reject"} className="justify-center font-mono font-medium text-sm border-2 border-blue-500 text-blue-500 py-px mt-1"/>
            </div>
        </div>
    )
}