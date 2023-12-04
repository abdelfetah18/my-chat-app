import ExplorePeople from "../../components/ExplorePeople";
import Navigation from "../../components/Navigation";
import { FaBell } from 'react-icons/fa';
import { getExplorePeople, getFriendRequests, getUser } from "../../database/client";
import { useState } from "react";
import ExploreFriendRequests from "../../components/ExploreFriendRequests";
import axios from "axios";


export async function getServerSideProps({ req }) {
    let user_info = req.userSession;
    let user = await getUser(user_info.user_id);
    let people_may_know = await getExplorePeople(user_info.user_id);
    let friends_requests = await getFriendRequests(user_info.user_id);

    return {
        props: {
            user,
            people_may_know,
            friends_requests
        }
    }
}

export default function Friends({ user, people_may_know, friends_requests }){
    let [User,setUser] = useState(user);
    let [PeopleMayKnow,setPeopleMayKnow] = useState(people_may_know);
    let [FriendRequests,setFriendRequests] = useState(friends_requests);

    function updateContent(){
        axios.get('/api/v1/user/you_may',{ headers:{ authorization:User.access_token } }).then((response) => {
            let data = response.data.data;
            setFriendRequests(data.friends_requests);
            setPeopleMayKnow(data.people_may_know);
        });
        // TODO: Get User info too.
    }

    return(
        <div className='flex flex-col md:flex-row background h-screen w-screen'>
            <Navigation page={'/friends'} />
            <div className='lg:w-5/6 md:w-11/12 w-full bg-[#f1f5fe] md:rounded-l-3xl flex flex-col items-center py-4'>
                <div className='w-11/12 flex flex-row justify-end items-center px-4 py-2'>
                    <FaBell className='font-mono text-[#ccd8e8] mx-1 text-base' />
                    <div className='font-mono text-[#9199a8] mx-1 text-sm'>Notifications</div>
                </div>
                <div className='w-11/12 text-start font-mono font-bold text-2xl py-2 text-[#02166c]'>Friends</div>
                <div className='flex flex-col w-11/12 overflow-auto'>
                    <ExploreFriendRequests FriendRequests={FriendRequests} User={User} updateContent={updateContent} />
                    <ExplorePeople PeopleMayKnow={PeopleMayKnow} User={User} updateContent={updateContent} />
                </div>
            </div>
        </div>
    )
}