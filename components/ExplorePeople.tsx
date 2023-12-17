import SubmitButton, { SubmitButtonResult } from "./SubmitButton";
import { User } from "../domain/Users";
import useExplorePeople from "../libs/hooks/useExplorePeople";

export default function ExplorePeople() {
    const { peopleMayKnow, inviteFriend } = useExplorePeople();

    if (peopleMayKnow.length == 0)
        return <></>

    return (
        <div className="w-full flex flex-col my-2 sm:my-0">
            <div className="font-mono text-base sm:text-lg font-semibold text-purple-800 uppercase">People you may know:</div>
            <div className="w-full flex flex-col">
                <div className="flex flex-row w-full flex-wrap">
                    {
                        peopleMayKnow.map((user: User, index: number) => <People key={index} user={user} inviteFriend={inviteFriend} />)
                    }
                </div>
            </div>
        </div>
    )
}

const People = ({ user, inviteFriend }) => {
    async function invite(): Promise<SubmitButtonResult> {
        await inviteFriend(user._id);
        return { status: "success" };
    }

    return (
        <div className="flex flex-col items-center lg:w-1/6 md:w-1/4 w-full rounded-lg my-1">
            <div className="flex flex-col items-center w-11/12 rounded-lg my-1 bg-purple-50 shadow-lg">
                <div className="w-full rounded-t-md">
                    <img alt="profile_image" className="w-full h-full rounded-t-md" src={user.profile_image != null ? user.profile_image.url + "?h=400&w=400&fit=crop&crop=center" : "/profile.png"} />
                </div>
                <div className="font-mono font-semibold text-base flex-grow pl-2 w-full my-2 text-purple-800">{user.username}</div>
                <div className="w-full px-1 my-2">
                    <SubmitButton key={crypto.randomUUID()} wrapperClassName={''} onClick={invite} text={"Add Friend"} className="bg-purple-200 text-purple-500 py-2 text-xs w-full justify-center" />
                </div>
            </div>
        </div>
    );
}
