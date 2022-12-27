import Navigation from "../components/Navigation";
import { FaBell,FaEdit,FaImage,FaTimes,FaCamera } from 'react-icons/fa';
import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { getData } from "../database/client";


export async function getServerSideProps({ req }) {
    var user_info = req.decoded_jwt;
    var user = await getData('*[_type=="users" && _id==$user_id][0]{ "user_id":_id,username,"profile_image":profile_image.asset->url,"cover_image":cover_image.asset->url,bio }',{ user_id:user_info.user_id });
    var people_may_know = await getData('*[_type=="users" && _id != $user_id && !(_id in [...*[_type=="chats" && (user._ref == $user_id)].inviter._ref,...*[_type=="chats" && (inviter._ref == $user_id)].user._ref])]{ _id,username,"profile_image":profile_image.asset->url,"cover_image":cover_image.asset->url,bio}',{ user_id:user_info.user_id });
    var friends_requests = await getData('*[_type=="chats" && state=="invite" && user._ref == $user_id]{ _id,"inviter":*[_type=="users" && _id==^.inviter._ref]{ _id,username,"profile_image":profile_image.asset->url,"cover_image":cover_image.asset->url,bio }[0]}',{ user_id:user_info.user_id });
    var rooms_you_may_like = await getData('*[_type=="rooms" && !(_id in *[_type=="room_members" && member._ref == $user_id].room._ref)]{_id,name,bio,"profile_image": profile_image.asset->url}',{ user_id:user_info.user_id });
   
    return {
        props: {
            user,
            people_may_know,
            friends_requests,
            rooms_you_may_like,
        }
    }
}

export default function Home({ user,people_may_know,friends_requests,rooms_you_may_like }){
    var [User,setUser] = useState(user);
    var [PeopleMayKnow,setPeopleMayKnow] = useState(people_may_know);
    var [FriendRequests,setFriendRequests] = useState(friends_requests);
    var [RoomsYouMayLike,setRoomsYouMayLike] = useState(rooms_you_may_like);

    var profile_image = useRef();
    var cover_image = useRef();

    var black_bg = useAnimation();
    var profile_info_box = useAnimation();
    var profile_image_box = useAnimation();
    var cover_image_box = useAnimation();
    var [uploadProgress,setUploadProgress] = useState(0);
    var [username,setUsername] = useState(User.username);
    var [bio,setBio] = useState(User.bio != null ? User.bio : '');

    useEffect(() => {
        var access_token = localStorage.getItem('access_token');
        setUser(state => { return { ...state,access_token } });
    },[]);

    function updateContent(){
        axios.get('/api/v1/user/you_may',{ headers:{ authorization:User.access_token } }).then((response) => {
            var data = response.data.data;
            setFriendRequests(data.friends_requests);
            setPeopleMayKnow(data.people_may_know);
            setRoomsYouMayLike(data.rooms_you_may_like);
        });
    }

    function update_user_info(){
        axios.post('/api/v1/edit', { user_id:User.user_id,username,bio },{ headers:{ authorization:User.access_token }}).then((response) => {
            console.log('response:',response.data);
            closeProfile();
        });
    }

    function upload_profile_image(){
        profile_image.current.click()
    }

    function onUploadProfileImage(evt){
        var form = new FormData();
        form.append('profile_image',evt.target.files[0]);
        form.append('user_id',User.user_id);
        axios.post('/api/v1/upload_profile_image',form,{
            onUploadProgress: (progressEvent) => setUploadProgress((progressEvent.loaded/progressEvent.total)*100,'%')
        }).then((response) => {
            setUploadProgress(0);
            console.log('response:',response.data);
            setUser(state => { return { ...state,profile_image:response.data.profile_image.url } })
        })
    }

    function upload_cover_image(){
        cover_image.current.click()
    }

    function onUploadCoverImage(evt){
        var form = new FormData();
        form.append('cover_image',evt.target.files[0]);
        form.append('user_id',User.user_id);
        axios.post('/api/v1/upload_cover_image',form,{
            onUploadProgress: (progressEvent) => setUploadProgress((progressEvent.loaded/progressEvent.total)*100,'%')
        }).then((response) => {
            setUploadProgress(0);
            console.log('response:',response.data);
            setUser(state => { return { ...state,cover_image:response.data.cover_image.url } })
        })
    }

    function closeProfile(){
        profile_image_box.start({
            opacity:0,
            transitionEnd: {
                display: "none",
            },
        },{
            duration:0.3,
        }).finally(() => {
            black_bg.start({
                opacity:0,
                transitionEnd: {
                    display: "none",
                },
            },{
                duration:0.3
            })
        });
        profile_info_box.start({
            opacity:0,
            transitionEnd: {
                display: "none",
            },
        },{
            duration:0.3,
        }).finally(() => {
            black_bg.start({
                opacity:0,
                transitionEnd: {
                    display: "none",
                },
            },{
                duration:0.3
            })
        });
        cover_image_box.start({
            opacity:0,
            transitionEnd: {
                display: "none",
            },
        },{
            duration:0.3,
        }).finally(() => {
            black_bg.start({
                opacity:0,
                transitionEnd: {
                    display: "none",
                },
            },{
                duration:0.3
            })
        });
    }

    function OpenProfile(){
        black_bg.start({
            opacity:1,
            display:'flex'
        },{
            duration:0.3
        }).finally(() => {
            profile_info_box.start({
                opacity:1,
                display:'flex'
            },{
                duration:0.3,
            })
        });
    }

    function OpenProfileImage(){
        black_bg.start({
            opacity:1,
            display:'flex'
        },{
            duration:0.3
        }).finally(() => {
            profile_image_box.start({
                opacity:1,
                display:'flex'
            },{
                duration:0.3,
            })
        });
    }

    function OpenCoverImage(){
        black_bg.start({
            opacity:1,
            display:'flex'
        },{
            duration:0.3
        }).finally(() => {
            cover_image_box.start({
                opacity:1,
                display:'flex'
            },{
                duration:0.3,
            })
        });
    }

    return(
        <div className='flex flex-col sm:flex-row background h-screen w-screen'>
            <Navigation page={'/'} />
            <div className='h-full lg:w-5/6 md:w-11/12 w-full bg-[#f1f5fe] sm:rounded-l-3xl flex flex-col px-10 py-4'>
                <div className='w-full flex flex-row justify-end items-center px-4 py-2'>
                    <div className='font-mono text-[#9199a8] mx-1 text-sm'>state:Sale</div>
                    <FaBell className='font-mono text-[#ccd8e8] mx-1 text-base' />
                </div>
                <div className='w-full text-start font-mono font-bold text-2xl px-4 py-2 text-[#02166c]'>Home</div>
                <div className='flex flex-col sm:flex-row w-full h-full overflow-auto'>
                    <div className="w-11/12 sm:w-1/2 flex flex-col items-center flex-grow overflow-auto">
                        <div className="w-11/12 flex flex-col">
                            <div className="font-mono text-lg font-semibold">Profile:</div>
                            <div className="w-full flex flex-col items-center">
                                <img className="object-cover w-40 h-40 rounded-full" alt='profile_image' src={User.profile_image != null ? User.profile_image : '/profile.jpeg'} />
                                <div className="font-mono text-lg font-semibold my-2">{User.username}</div>
                            </div>
                            <div className="w-full flex flex-col items-center">
                                <div onClick={OpenProfile} className="w-11/12 sm:my-0 my-1 sm:w-1/2 flex flex-row items-center justify-center">
                                    <FaEdit className="w-1/6 font-mono text-base text-gray-500 cursor-pointer hover:text-gray-700" />
                                    <div className="w-5/6 font-mono text-sm sm:text-base text-gray-500 cursor-pointer hover:text-gray-700">Edit profile info</div>
                                </div>
                                <div onClick={OpenProfileImage} className="w-11/12 sm:my-0 my-1 sm:w-1/2 flex flex-row items-center justify-center">
                                    <FaImage className="w-1/6 font-mono text-sm sm:text-base text-gray-500 cursor-pointer hover:text-gray-700" />
                                    <div className="w-5/6 font-mono text-sm sm:text-base text-gray-500 cursor-pointer hover:text-gray-700">Change profile image</div>
                                </div>
                                <div onClick={OpenCoverImage} className="w-11/12 sm:my-0 my-1 sm:w-1/2 flex flex-row items-center justify-center">
                                    <FaImage className="w-1/6 font-mono text-sm sm:text-base text-gray-500 cursor-pointer hover:text-gray-700" />
                                    <div className="w-5/6 font-mono text-sm sm:text-base text-gray-500 cursor-pointer hover:text-gray-700">Change cover image</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full sm:w-1/2 flex flex-col flex-grow overflow-auto">
                        {
                            (FriendRequests.length > 0) ? (
                                <div className="w-11/12 flex flex-col my-2 sm:my-0">
                                    <div className="font-mono text-base sm:text-lg font-semibold">Friends requests:</div>
                                    <div className="w-full flex flex-col">
                                        <div className="flex flex-row w-full p-2">
                                            {
                                                FriendRequests.map((chat,j) => {
                                                    function accept(){
                                                        axios.post('/api/v1/accept?type=friend',{ chat_id:chat._id },{ headers:{ authorization:User.access_token }}).then((response) => updateContent());
                                                    }

                                                    function reject(){
                                                        axios.post('/api/v1/reject?type=friend',{ chat_id:chat._id },{ headers:{ authorization:User.access_token }}).then((response) => updateContent());
                                                    }

                                                    return (
                                                        <div key={j} className="flex flex-col w-40 shadow-lg items-center rounded mx-2">
                                                            <div className="w-40 h-40">
                                                                <img className="w-full h-full object-cover rounded" src={chat.inviter.profile_image != null ? chat.inviter.profile_image : "/profile.jpeg"} />
                                                            </div>
                                                            <div className="font-mono font-semibold text-xl my-1">{chat.inviter.username}</div>
                                                            <div onClick={accept} className="w-11/12 mt-2 mb-1 font-mono font-bold text-base bg-blue-500 rounded text-center text-white cursor-pointer">accept</div>
                                                            <div onClick={reject} className="w-11/12 mb-2 font-mono font-bold text-base border-2 border-blue-500 rounded text-center text-blue-500 cursor-pointer">reject</div>
                                                        </div>

                                                    );
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            ) : ""
                        }

                        <div className="w-11/12 flex flex-col my-2 sm:my-0">
                            <div className="font-mono text-base sm:text-lg font-semibold">People you may know:</div>
                            <div className="w-full flex flex-col">
                                <div className="flex flex-col w-full p-2 flex-wrap">
                                    {
                                        PeopleMayKnow.map((u,i) => {
                                            function invite(){
                                                axios.post('/api/v1/invite?type=friend',{ user_id:u._id },{ headers:{ authorization:User.access_token }}).then((response) => updateContent());
                                            }

                                            return (
                                                <div key={i} className="flex flex-row items-center w-11/12 rounded my-1 bg-gray-100 px-2 py-1">
                                                    <div className="w-10 h-10 rounded-full">
                                                        <img className="w-10 h-10 rounded-full" src={u.profile_image != null ? u.profile_image : "/profile.jpeg"} />
                                                    </div>
                                                    <div className="font-mono font-semibold text-base flex-grow px-4">{u.username}</div>
                                                    <div onClick={invite} className="font-mono font-bold text-xs bg-blue-200 rounded text-blue-500 cursor-pointer px-4 py-1">add friend</div>
                                                </div>

                                            );
                                        })

                                    }
                                </div>
                            </div>
                        </div>

                        <div className="w-full sm:w-11/12 flex flex-col my-2 sm:my-0">
                            <div className="font-mono text-sm sm:text-lg font-semibold">Rooms you may like to join:</div>
                            <div className="w-full flex flex-col">
                                <div className="flex flex-row w-full p-2 flex-wrap">
                                    {
                                        RoomsYouMayLike.map((r,i) => {
                                                function join(){
                                                    axios.post('/api/v1/room/join',{
                                                        room_id:r._id
                                                    },{
                                                        headers:{ authorization:User.access_token }
                                                    }).then((response) => updateContent());
                                                }

                                                return (
                                                    <div key={i} className="flex flex-col items-center w-1/3 my-2">
                                                        <div className="flex flex-col w-11/12 shadow-lg items-center rounded">
                                                            <div className="w-11/12 ">
                                                                <img className="object-cover w-full rounded" src={r.profile_image != null ? r.profile_image : "/profile.jpeg"} />
                                                            </div>
                                                            <div className="font-mono font-semibold text-base sm:text-base my-1">{r.name}</div>
                                                            <div onClick={join} className="w-11/12 my-2 font-mono font-bold text-sm bg-blue-200 rounded text-center text-blue-500 cursor-pointer">Join</div>
                                                        </div>
                                                    </div>
                                                );
                                        })

                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <motion.div onClick={closeProfile} animate={black_bg} className="hidden absolute h-screen w-screen bg-[#000000cc]"></motion.div>
            <motion.div animate={profile_info_box} className="absolute top-[15vh] left-1/4 w-1/2 h-1/2 bg-[#fffdfdfd] rounded-xl hidden flex-col">
                <div className="w-full flex flex-row justify-end">
                    <FaTimes onClick={closeProfile} className="mx-2 my-2 text-xl cursor-pointer" />
                </div>
                <div className="flex flex-col items-center w-full" >
                    <div className="w-11/12 flex flex-col my-4">
                        <div className="font-mono text-xl font-medium">username:</div>
                        <input placeholder="username" className="w-5/6 border-b-2 font-mono text-base py-2 mx-2" onChange={(e) => setUsername(e.target.value)} value={username} />
                    </div>
                    <div className="w-11/12 flex flex-col my-4">
                        <div className="font-mono text-xl font-medium">bio:</div>
                        <input placeholder="bio" className="w-5/6 border-b-2 font-mono text-base py-2 mx-2" onChange={(e) => setBio(e.target.value)} value={bio} />
                    </div>
                    <div onClick={update_user_info} className="absolute bottom-6">
                        <div className="cursor-pointer font-mono font-bold text-lg text-white bg-blue-500 rounded-xl px-4 py-1">Save</div>
                    </div>
                </div>
            </motion.div>

            <motion.div animate={profile_image_box} className="absolute top-[15vh] left-1/4 w-1/2  bg-[#fffdfdfd] rounded-xl hidden flex-col">
                <div className="w-full flex flex-row justify-end">
                    <FaTimes onClick={closeProfile} className="mx-2 my-2 text-xl cursor-pointer" />
                </div>
                <div className="flex flex-col items-center w-full" >
                    <div className="flex flex-col w-full">
                        <img className="w-full h-40 object-cover" alt='cover_image' src={User.cover_image != null ? User.cover_image : '/profile.jpeg'} />
                    </div>
                    <div className="bg-white w-11/12 flex flex-col items-center">
                        <img className="object-cover shadow-[0_0_10px] w-40 h-40 rounded-full self-center relative top-[-100px]" alt="profile_image" src={User.profile_image != null ? User.profile_image : '/profile.jpeg'} />
                        <div onClick={upload_profile_image} className="hover:bg-blue-700 cursor-pointer flex flex-col items-center justify-center h-8 w-8 bg-blue-500 rounded-full relative top-[-150px] left-[65px]">
                            <FaCamera className="text-white text-lg" />
                        </div>
                        <div className="relative bottom-32 font-bold font-mono text-xl">{User.username}</div>
                        <div className="flex flex-col items-center w-full relative bottom-24">
                            <div className="h-1 bg-red-500 rounded self-start" style={{width: (Math.floor(uploadProgress)).toString()+'%' }}></div>
                            <div className="font-mono font-semibold text-base">{Math.floor(uploadProgress)}%</div>
                        </div>
                    </div>
                </div>
                <input name='profile_image' onChange={onUploadProfileImage} ref={profile_image} hidden type={'file'} />
            </motion.div>

            <motion.div animate={cover_image_box} className="absolute top-[15vh] left-1/4 w-1/2  bg-[#fffdfdfd] rounded-xl hidden flex-col">
                <div className="w-full flex flex-row justify-end">
                    <FaTimes onClick={closeProfile} className="mx-2 my-2 text-xl cursor-pointer" />
                </div>
                <div className="flex flex-col items-center w-full" >
                    <div className="flex flex-col w-full">
                        <img className="w-full h-40 object-cover" alt='cover_image' src={User.cover_image != null ? User.cover_image : '/profile.jpeg'} />
                        <div onClick={upload_cover_image} className="hover:bg-blue-700 cursor-pointer flex flex-col items-center justify-center h-8 w-8 bg-blue-500 rounded-full self-end relative bottom-10 right-2">
                            <FaCamera className="text-white text-lg" />
                        </div>
                    </div>
                    <div className="bg-white w-11/12 flex flex-col items-center">
                        <img className="object-cover shadow-[0_0_10px] w-40 h-40 rounded-full self-center relative top-[-100px]" alt="profile_image" src={User.profile_image != null ? User.profile_image : '/profile.jpeg'} />
                        <div className="relative bottom-24 font-bold font-mono text-xl">{User.username}</div>
                    </div>
                    <div className="flex flex-col w-full items-center my-2">
                        <div className="cursor-pointer font-mono font-bold text-lg text-white bg-blue-500 rounded-xl px-4 py-1">Save</div>
                    </div>
                </div>
                <input name='cover_image' onChange={onUploadCoverImage} ref={cover_image} hidden type={'file'} />
            </motion.div>
        </div>
    )
}
