import DatePicker from 'react-datepicker'
import { useContext, useState } from "react";
import useUserSession from "../libs/hooks/useUserSession";
import 'react-datepicker/dist/react-datepicker.css'
import Loading from '../components/Loading';
import ToastContext from '../libs/contexts/ToastContext';


export default function SignUp() {
    const toastManager = useContext(ToastContext);
    const { signUp } = useUserSession();
    const [birthdate, setBirthdate] = useState(new Date());
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [is_loading, setIsLoading] = useState(false);

    async function sign_up() {
        setIsLoading(true);
        let response = await signUp({ username, bio: '', email, password, birthdate: birthdate.toLocaleString() });
        setIsLoading(false);
        if(response.status == "error"){
            toastManager.alertError(response.message);
        }else{
            toastManager.alertSuccess("Sign up successfuly");
            window.location.pathname = "/sign_in";
        }
    }

    return (
        <div className='flex flex-col w-1/2 items-center justify-center'>
            <div className="flex flex-col w-11/12 py-2 px-4 items-center">
                <input className="my-1 font-mono px-4 py-2 rounded w-full outline-none focus:bg-purple-200/60 focus:placeholder:text-purple-300" onChange={(evt) => setUsername(evt.target.value)} value={username} placeholder="Username" />
                <input className="my-1 font-mono px-4 py-2 rounded w-full outline-none focus:bg-purple-200/60 focus:placeholder:text-purple-300" onChange={(evt) => setEmail(evt.target.value)} value={email} placeholder="Email" />
                <input className="my-1 font-mono px-4 py-2 rounded w-full outline-none focus:bg-purple-200/60 focus:placeholder:text-purple-300" type={"password"} onChange={(evt) => setPassword(evt.target.value)} value={password} placeholder="Password" />
                <div className="flex flex-row w-fit my-2 justify-between">
                    <DatePicker className="w-fit px-4 py-2" selected={birthdate} onChange={(date) => setBirthdate(date)} />
                </div>
            </div>
            <div className="flex flex-col w-11/12 py-2 px-4 items-center">
                <div className="w-full text-center rounded-full font-mono font-bold text-base bg-purple-400 hover:bg-purple-600 px-4 py-2 text-white cursor-pointer" onClick={sign_up}>Sign Up</div>
            </div>

            { is_loading && <Loading /> }

        </div>
    )
}