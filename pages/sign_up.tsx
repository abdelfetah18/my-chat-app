import { useContext, useState } from "react";
import useUserSession from "../libs/hooks/useUserSession";
import 'react-datepicker/dist/react-datepicker.css'
import Loading from '../components/Loading';
import ToastContext from '../libs/contexts/ToastContext';
import Link from 'next/link';


export default function SignUp() {
    const toastManager = useContext(ToastContext);
    const { signUp } = useUserSession();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [is_loading, setIsLoading] = useState(false);

    async function sign_up() {
        setIsLoading(true);
        let response = await signUp({ username, bio: '', email, password });
        setIsLoading(false);
        if (response.status == "error") {
            toastManager.alertError(response.message);
        } else {
            toastManager.alertSuccess("Sign up successfuly");
            window.location.pathname = "/sign_in";
        }
    }

    return (
        <div className='flex flex-col w-1/2 items-center justify-center mt-10'>
            <div className="flex flex-col w-full gap-4 items-center">
                <div className='w-full'>
                    <div>Username:</div>
                    <input className="px-4 py-2 rounded-xl w-full outline-none focus:bg-purple-200/60 focus:placeholder:text-purple-300" onChange={(evt) => setUsername(evt.target.value)} value={username} placeholder="Username" />
                </div>
                <div className='w-full'>
                    <div>Email:</div>
                    <input className="px-4 py-2 rounded-xl w-full outline-none focus:bg-purple-200/60 focus:placeholder:text-purple-300" onChange={(evt) => setEmail(evt.target.value)} value={email} placeholder="Email" />
                </div>
                <div className='w-full'>
                    <div>Password:</div>
                    <input className="px-4 py-2 rounded-xl w-full outline-none focus:bg-purple-200/60 focus:placeholder:text-purple-300" type={"password"} onChange={(evt) => setPassword(evt.target.value)} value={password} placeholder="Password" />
                </div>
            </div>
            <div className="w-full flex items-center gap-2 mt-4 text-sm">
                <div>Already have an account?</div>
                <Link href={"/sign_in"} className="text-primaryColor font-semibold cursor-pointer active:scale-105 duration-300 select-none">Sign In</Link>
            </div>
            <div className="flex flex-col w-full items-center mt-8">
                <div className="w-full text-center rounded-full font-bold text-base bg-purple-400 hover:bg-purple-600 px-4 py-2 text-white cursor-pointer" onClick={sign_up}>Sign Up</div>
            </div>

            {is_loading && <Loading />}

        </div>
    )
}