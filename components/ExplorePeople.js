import axios from "axios";
import SubmitButton from "./SubmitButton";

export default function ExplorePeople({ PeopleMayKnow, User, updateContent }){
    if(PeopleMayKnow.length == 0)
        return <></>

    return (
        <div className="w-full flex flex-col my-2 sm:my-0">
            <div className="font-mono text-base sm:text-lg font-semibold">People you may know:</div>
            <div className="w-full flex flex-col">
                <div className="flex flex-row w-full flex-wrap">
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
        <div className="flex flex-col items-center w-1/6 rounded-lg my-1">
            <div className="flex flex-col items-center w-11/12 rounded-lg my-1 bg-gray-50 shadow-lg">
                <div className="w-full rounded-t-md">
                    <img className="w-full h-full rounded-t-md" src={user.profile_image != null ? user.profile_image : "/profile.jpeg"} />
                </div>
                <div className="font-mono font-semibold text-base flex-grow pl-2 w-full my-2">{user.username}</div>
                <div className="w-full px-1 my-2">
                    <SubmitButton onClick={invite} text={"Add Friend"} className="bg-blue-200 text-blue-500 py-1 text-xs w-full justify-center" />
                </div>
            </div>
        </div>
    );
}
