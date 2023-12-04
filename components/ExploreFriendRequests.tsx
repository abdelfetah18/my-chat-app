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
        <div className="lg:w-1/6 md:w-1/4 w-full flex flex-col items-center my-1">
            <div className="w-full flex flex-col items-center my-1 bg-gray-50 shadow-lg rounded-lg">
                <div className="w-full bg-gray-100 rounded-t-lg shadow">
                    <img className="w-full h-full rounded-t-lg" src={friend_request.inviter.profile_image != null ? friend_request.inviter.profile_image+"?h=400&w=400&fit=crop&crop=center" : "/profile.png"} />
                </div>
                <div className="font-mono font-semibold text-sm flex-grow w-full px-4 my-4">{friend_request.inviter.username}</div>
                <div className="w-full px-2 mb-2">
                    <SubmitButton wrapperClassName={''} onClick={accept} text={"ACCEPT"} className="w-full justify-center font-mono font-semibold text-sm bg-blue-500 border-2 border-blue-500 text-white py-px" />
                    <SubmitButton wrapperClassName={''} onClick={reject} text={"REJECT"} className="w-full justify-center font-mono font-semibold text-sm border-2 border-blue-500 text-blue-500 py-px mt-1"/>
                </div>
            </div>
        </div>
    )
}