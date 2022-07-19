import _Navigation from "../components/_Navigation";
import { FaBell } from 'react-icons/fa';
import { useRef, useState } from "react";
import axios from "axios";
import { useAnimation,motion } from "framer-motion";
import { useCookies } from "react-cookie";

export default function SignIn(){
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [cookies, setCookie, removeCookie] = useCookies();
    var alertBoxAnimation = useAnimation();
    var alertBox = useRef();

    function sign_in(evt){
        axios.post('/api/v1/sign_in',{
            username,password
        }).then((response) => {
            console.log('res:',response.data);
            console.log("response:",response);
            if(response.data.status === 'success'){
                localStorage.setItem('access_token',response.data.token);
                setCookie("access_token",response.data.token);
                alertBox.current.innerText = response.data.message;
                alertBoxAnimation.start({
                    opacity:1,
                    backgroundColor:'#7ded4e'
                },{
                    duration:0.5
                });
                location.href = '/'
            }else{
                alertBox.current.innerText = response.data.message;
                alertBoxAnimation.start({
                    opacity:1,
                    backgroundColor:'#ff4343'
                },{
                    duration:0.5
                })
            }
        }).catch((err) => console.log('error:',err));
    }

    return(
        <div className='flex flex-row background h-screen w-screen'>
            <_Navigation page={'/sign_in'} />
            <div className='w-full md:w-full lg:w-11/12 bg-[#f1f5fe] rounded-l-3xl flex flex-col px-10 py-4 items-center'>
                <div className='opacity-0 w-full flex flex-row justify-end items-center px-4 py-2'>
                    <div className='font-mono text-[#9199a8] mx-1 text-sm'>state:Sale</div>
                    <FaBell className='font-mono text-[#ccd8e8] mx-1 text-base' />
                </div>
                <div className='w-full text-start font-mono font-bold text-2xl px-4 py-2 text-[#02166c]'>Sign In</div>
                <div className='flex flex-col w-1/2 items-center justify-center'>
                    <div className="flex flex-col w-11/12 py-2 px-4">
                        <motion.div ref={alertBox} animate={alertBoxAnimation} className="my-2 px-4 py-2 w-full font-mono text-base text-white font-semibold rounded opacity-0 bg-[#ff4343]"></motion.div>
                        <input className="my-1 font-mono px-4 py-2 rounded" onChange={(evt) => setUsername(evt.target.value)} value={username} placeholder="username" />
                        <input className="my-1 font-mono px-4 py-2 rounded" onChange={(evt) => setPassword(evt.target.value)} value={password} placeholder="password" />
                    </div>
                    <div className="flex flex-col w-11/12 py-2 px-4 items-center">
                        <div className="font-mono font-bold text-base bg-blue-600 rounded px-4 py-2 text-white cursor-pointer" onClick={sign_in}>Sign in</div>
                    </div>
                </div>
            </div>
        </div>
    )
}