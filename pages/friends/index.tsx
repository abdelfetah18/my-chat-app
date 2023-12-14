import ExplorePeople from "../../components/ExplorePeople";
import ExploreFriendRequests from "../../components/ExploreFriendRequests";


export default function Friends() {
    return (
        <div className='flex flex-col w-11/12 overflow-auto'>
            <ExploreFriendRequests />
            <ExplorePeople />
        </div>
    )
}