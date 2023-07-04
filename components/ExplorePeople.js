import axios from "axios";
import SubmitButton from "./SubmitButton";

export default function ExplorePeople({ PeopleMayKnow, User, updateContent }){
    if(PeopleMayKnow.length == 0)
        return <></>

    return (
        <div className="w-full flex flex-col my-2 sm:my-0">
            <div className="font-mono text-base sm:text-lg font-semibold">People you may know:</div>
            <div className="w-full flex flex-col">
                <div className="flex flex-col w-full flex-wrap">
                {
                    PeopleMayKnow.map((u, i) => <People key={i} user={u} User={User} updateContent={updateContent} />)

                }
                </div>
            </div>
        </div>
    )
}

const People = ({ user, User, updateContent }) => {
    async function invite(ev){
        let response = await axios.post('/api/v1/user/invite',{ friend_id:user._id },{ headers:{ authorization:User.access_token }});
        let payload = response.data;
        payload.callback = updateContent;
        return payload;
    }

    return (
        <div className="flex flex-row items-center w-full rounded-lg my-1 bg-gray-50 shadow-lg p-2">
            <div className="w-10 h-10 rounded-full">
                <img className="w-full h-full rounded-full" src={user.profile_image != null ? user.profile_image : "/profile.jpeg"} />
            </div>
            <div className="font-mono font-semibold text-base flex-grow pl-2">{user.username}</div>
            <div>
                <SubmitButton onClick={invite} text={"Add Friend"} className="bg-blue-200 text-blue-500 py-1 text-xs"  />
            </div>
        </div>
    );
}
