import _Navigation from "../components/_Navigation";
import { FaBell } from 'react-icons/fa';
import { useRef, useState } from "react";
import axios from "axios";
import { useAnimation,motion } from "framer-motion";
import { useCookies } from "react-cookie";

export default function SignIn(){
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [is_loading,setIsLoading] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies();
    var alertBoxAnimation = useAnimation();
    var alertBox = useRef();

    function sign_in(evt){
        if(!is_loading){
            setIsLoading(true);
            axios.post('/api/v1/sign_in',{
                username,password
            }).then((response) => {
                setIsLoading(false);
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
            }).catch((err) => {
                setIsLoading(false);
                // TODO: show error message to the user.
                console.log('error:',err);
            });
        }
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
                <div className='flex flex-col w-full sm:w-1/2 items-center justify-center'>
                    <div className="flex flex-col w-full py-2 px-4">
                        <motion.div ref={alertBox} animate={alertBoxAnimation} className="my-2 px-4 py-2 w-full font-mono text-base text-white font-semibold rounded opacity-0 bg-[#ff4343]"></motion.div>
                        <input className="my-1 font-mono px-4 py-2 rounded" onChange={(evt) => setUsername(evt.target.value)} value={username} placeholder="username" />
                        <input onKeyUp={(e) => { if(e.code == 'Enter'){ sign_in() }}} type={"password"} className="my-1 font-mono px-4 py-2 rounded" onChange={(evt) => setPassword(evt.target.value)} value={password} placeholder="password" />
                    </div>
                    <div className="flex flex-col w-11/12 py-2 px-4 items-center">
                        <div className="font-mono font-bold text-base bg-blue-600 rounded px-4 py-2 text-white cursor-pointer" onClick={sign_in}>Sign in</div>
                    </div>
                </div>
            </div>
            {
                is_loading ? (
                    <div className="absolute flex flex-col items-center justify-center h-screen w-screen bg-[#00000099]">
                        <div role="status">
                            <svg aria-hidden="true" className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"></path>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"></path>
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                ) : ('')
            }
        </div>
    )
}