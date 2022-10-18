import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaHome,FaCommentAlt,FaCog,FaBell,FaSearch,FaPaperPlane,FaPaperclip,FaSmile,FaTimes } from 'react-icons/fa';

export default function RecentRooms({ User,my_rooms,room_requests,setMyRooms }){
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var [search_q,setSearchQ] = useState("");

    useEffect(() => {
        if(search_q.length > 0){
            search_rooms();
        }else{
            updateRooms();
        }
    },[search_q]); 

    function search_rooms(){
        axios.get('/api/v1/room/search?name='+search_q,{
            headers:{
                authorization:User.access_token
            }
        }).then((response) => {
            if(response.data.status == 'success'){
                setMyRooms(response.data.data);
            }
        });
    }

    function updateRooms(){
        axios.get('/api/v1/user/rooms',{
            headers:{
                authorization:User.access_token
            }
        }).then((response) => {
            if(response.data.status == 'success'){
                setMyRooms(response.data.data);
            }
        });
    }

    return(
        <div className='md:w-1/6 lg:flex md:flex hidden flex-col lg:w-2/6 items-center'>
            <div className='md:hidden my-2 lg:flex flex-row w-5/6 bg-[#fafbff] items-center px-4 py-2 rounded-xl'>
                <input className='w-11/12 font-mono text-xl bg-transparent px-4' value={search_q} onChange={(evt) => setSearchQ(evt.target.value)} placeholder='Search' />
                <FaSearch className='w-1/12 text-[#c8cee5]' />
            </div>

            {
                my_rooms.map((c,i) => {
                function calcTime(timestamp,diveder){
                    return[Math.floor(timestamp/diveder),timestamp % diveder];
                }
                var time_ago = (c.message != null) ? Date.now() - (new Date(c.message.created_at || c.message._createdAt)) : 0;
                var [days,r_days] = calcTime(time_ago,1000*60*60*24);
                var [hours,r_hours] = calcTime(r_days,1000*60*60);
                var [minutes,r_minutes] = calcTime(r_hours,1000*60);
                var [seconds,mileseconds] = calcTime(r_minutes,1000);

                return(
                    <div key={i} onClick={() => window.location.href = '/rooms/'+c.room._id } className='md:w-fit hover:shadow-xl cursor-pointer my-2 flex flex-row lg:w-5/6 bg-[#fafbff] items-center px-4 py-2 rounded-xl'>
                        <div className='lg:w-1/6 md:w-full'>
                            <img className='object-cover w-14 h-14 rounded-full border-white border-[3px]' src={(c.room.profile_image != null ? c.room.profile_image : '/profile.jpeg')} />
                        </div>
                        <div className='lg:flex flex-col lg:w-5/6 md:hidden'>
                            <div className='w-full text-end font-mono text-xs font-semibold text-[#a2aac1]'>{(c.message != null) ? ((days > 1) ? ((new Date(c.message.created_at || c.message._createdAt)).getDate().toString()+' '+months[(new Date(c.message.created_at || c.message._createdAt)).getMonth()]) : (hours != 0 ? hours.toString()+' hours' : minutes.toString()+' minutes' )) : ''}</div>
                            <div className='flex flex-row w-full'>
                                <div className='flex flex-col w-11/12 px-2'>
                                    <div className='font-mono text-base font-bold text-[#020762]'>{c.room.name}</div>
                                    <div className='font-mono text-xs font-medium text-[#b7bfcc] text-ellipsis w-full'>{ c.message != null ? (c.message.user._ref === User.user_id ? 'you: '+(c.message.type === "text" ? c.message.message : 'send a '+c.message.type) : (c.message.type === "text" ? c.message.message : 'send a '+c.message.type)) : '' }</div>
                                </div>
                                 {/* TODO: unread messages counter, not available because unread state is not implemented! */}
                                <div className='hidden items-center justify-center w-1/12'>
                                    <div className='font-mono bg-[#fd476f] rounded-full h-4 w-4 text-center text-xs text-white'>5</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                })
            }

            {
                room_requests != null ? (
                <div className='w-11/12 flex flex-col'>
                <div className='w-11/12 text-lg font-mono font-semibold text-[#02166c]'>new members requests:</div>
                <div className='w-11/12 flex flex-col'>
                    {
                    room_requests.member_requests.map((r,i) => {
                        function accept(){
                        axios.post('/api/v1/accept?type=room',{ request_id:r._id },{ headers:{ authorization:User.access_token }}).then((response) => console.log('response:',response.data));
                        }   

                        function reject(){
                        axios.post('/api/v1/reject?type=room',{ request_id:r._id },{ headers:{ authorization:User.access_token }}).then((response) => console.log('response:',response.data));
                        }  

                        return(
                        <div key={i} className='w-full hover:shadow-xl cursor-pointer my-2 flex flex-row bg-[#fafbff] items-center px-4 py-2 rounded-xl'>
                            <div className='lg:w-1/6 md:w-full'>
                                <img className='object-cover w-14 h-14 rounded-full' src={r.user.profile_image != null ? r.user.profile_image : '/profile.jpeg'} />
                            </div>
                            <div className='lg:flex flex-col lg:w-5/6 md:hidden'>
                                <div className='w-full text-end font-mono text-xs font-semibold text-[#a2aac1]'>{/*(c.message != null) ? ((days > 1) ? ((new Date(c.message.created_at || c.message._createdAt)).getDate().toString()+' '+months[(new Date(c.message.created_at || c.message._createdAt)).getMonth()]) : (hours != 0 ? hours.toString()+' hours' : minutes.toString()+' minutes' )) : ''*/}20 june</div>
                                <div className='flex flex-row w-full'>
                                    <div className='flex flex-col w-11/12 px-2'>
                                        <div className='font-mono text-base font-bold text-[#020762]'>{r.user.username}</div>
                                    </div>
                                </div>
                                <div className='flex flex-row w-full justify-end'>
                                <div onClick={accept} className='mx-2 font-mono text-base font-bold text-white px-4 bg-green-400 rounded text-center'>accept</div>
                                <div onClick={reject} className='mx-2 font-mono text-base font-bold text-white px-4 bg-red-400 rounded text-center'>reject</div>
                                </div>
                            </div>
                        </div>
                        )
                    })
                    }
                </div>
                </div>
                ) : ('')
            }

        </div>
    )
}