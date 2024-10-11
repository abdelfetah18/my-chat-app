import SubmitButton, { SubmitButtonResult } from "./SubmitButton";
import { User } from "../domain/Users";
import useExplorePeople from "../libs/hooks/useExplorePeople";

export default function ExplorePeople() {
    const { peopleMayKnow, inviteFriend } = useExplorePeople();

    if (peopleMayKnow.length == 0)
        return <></>

    return (
        <div className="w-full grid grid-cols-5 gap-6">
            {
                peopleMayKnow.map((user: User, index: number) => <People key={index} user={user} inviteFriend={inviteFriend} />)
            }
        </div>
    )
}

const People = ({ user, inviteFriend }) => {
    async function invite(): Promise<SubmitButtonResult> {
        await inviteFriend(user._id);
        return { status: "success" };
    }

    return (
        <div className="flex flex-col items-center w-full rounded-lg">
            <div className="flex flex-col items-center w-full rounded-lg bg-gray-100">
                <div className="w-full aspect-square rounded-t-md">
                    <img alt="profile_image" className="w-full h-full aspect-square rounded-t-md" src={user.profile_image != null ? user.profile_image.url + "?h=400&w=400&fit=crop&crop=center" : "/profile.png"} />
                </div>
                <div className="px-2 text-base flex-grow w-full text-black">{user.username}</div>
                <div className="w-full px-1 my-2">
                    <SubmitButton key={crypto.randomUUID()} onClick={invite} text={"Add Friend"} className="flex items-center rounded-full bg-primaryColor text-white py-1 text-sm w-full justify-center cursor-pointer select-none active:scale-105 duration-300 hover:bg-secondaryColor" />
                </div>
            </div>
        </div>
    );
}
