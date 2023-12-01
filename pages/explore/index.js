import Navigation from "../../components/Navigation";
import { FaBell } from 'react-icons/fa';
import { getExploreRooms, getUser } from "../../database/client";
import { useState } from "react";
import ExploreRooms from "../../components/ExploreRooms";


export async function getServerSideProps({ req }) {
    let user_info = req.decoded_jwt;
    let user = await getUser(user_info.user_id);
    let rooms_you_may_like = await getExploreRooms(user_info.user_id);

    return {
        props: { user, rooms_you_may_like }
    }
}

export default function Explore({ user, rooms_you_may_like }){
    let [User,setUser] = useState(user);
    let [RoomsYouMayLike,setRoomsYouMayLike] = useState(rooms_you_may_like);

    function updateContent(){
        axios.get('/api/v1/user/you_may',{ headers:{ authorization:User.access_token } }).then((response) => {
            let data = response.data.data;
            setFriendRequests(data.friends_requests);
            setPeopleMayKnow(data.people_may_know);
            setRoomsYouMayLike(data.rooms_you_may_like);
        });
        // TODO: Get User info too.
    }

    return(
        <div className='flex flex-col sm:flex-row background h-screen w-screen'>
            <Navigation page={'/explore'} />
            <div className='lg:w-5/6 md:w-11/12 w-full bg-[#f1f5fe] md:rounded-l-3xl flex flex-col items-center py-4'>
                <div className='w-11/12 flex flex-row justify-end items-center py-2'>
                    <FaBell className='font-mono text-[#ccd8e8] mx-1 text-base' />
                    <div className='font-mono text-[#9199a8] mx-1 text-sm'>Notifications</div>
                </div>
                <div className='w-11/12 text-start font-mono font-bold text-2xl py-2 text-[#02166c]'>Explore</div>
                <div className='flex flex-col w-11/12 overflow-auto'>
                    <ExploreRooms RoomsYouMayLike={RoomsYouMayLike} User={User} updateContent={updateContent} />
                </div>
            </div>
        </div>
    )
}