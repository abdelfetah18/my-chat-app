import _Navigation from "../../components/_Navigation";
import { FaBell } from 'react-icons/fa';
import DatePicker from 'react-datepicker'
import { useRef, useState } from "react";
import 'react-datepicker/dist/react-datepicker.css'
import axios from 'axios';
import { motion, useAnimation } from "framer-motion"


export default function SignUp(){
    const [birthdate, setBirthdate] = useState(new Date());
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    var alertBoxAnimation = useAnimation();
    var alertBox = useRef();

    function sign_up(evt){
        axios.post('/api/v1/sign_up',{ username,password,birthdate }).then((response) => {
            console.log("response:",response);
            if(response.data.status === 'success'){
                alertBox.current.innerText = response.data.message;
                alertBoxAnimation.start({
                    opacity:1,
                    backgroundColor:'#7ded4e'
                },{
                    duration:0.5
                })
                location.href = '/sign_in'
            }else{
                alertBox.current.innerText = response.data.message;
                alertBoxAnimation.start({
                    opacity:1,
                    backgroundColor:'#ff4343'
                },{
                    duration:0.5
                })
            }
        }).catch((err) => {
            console.log("err:",err);
        })
    }

    return(
        <div className='flex flex-row background h-screen w-screen'>
            <_Navigation page={'/sign_up'} />
            <div className='w-11/12 bg-[#f1f5fe] rounded-l-3xl flex flex-col px-10 py-4 items-center'>
                <div className='opacity-0 w-full flex flex-row justify-end items-center px-4 py-2'>
                    <div className='font-mono text-[#9199a8] mx-1 text-sm'>state:Sale</div>
                    <FaBell className='font-mono text-[#ccd8e8] mx-1 text-base' />
                </div>
                <div className='w-full text-start font-mono font-bold text-2xl px-4 py-2 text-[#02166c]'>Sign Up</div>
                <div className='flex flex-col w-1/2 items-center justify-center'>
                    <div className="flex flex-col w-11/12 py-2 px-4 items-center">
                        <motion.div ref={alertBox} animate={alertBoxAnimation} className="my-2 px-4 py-2 w-full font-mono text-base text-white font-semibold rounded opacity-0 bg-[#ff4343]"></motion.div>
                        <input className="my-1 font-mono px-4 py-2 rounded w-full" onChange={(evt) => setUsername(evt.target.value) } value={username} placeholder="username" />
                        <input className="my-1 font-mono px-4 py-2 rounded w-full" onChange={(evt) => setPassword(evt.target.value) } value={password} placeholder="password" />
                        <div className="flex flex-row w-fit my-2 justify-between">
                            <DatePicker className="w-fit px-4 py-2" selected={birthdate} onChange={(date) => setBirthdate(date)} />
                        </div>
                    </div>
                    <div className="flex flex-col w-11/12 py-2 px-4 items-center">
                        <div className="font-mono font-bold text-base bg-blue-600 rounded px-4 py-2 text-white cursor-pointer" onClick={sign_up}>Sign Up</div>
                    </div>
                </div>
            </div>
        </div>
    )
}