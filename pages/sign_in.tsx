import _Navigation from "../components/_Navigation";
import { useContext, useState } from "react";
import { useCookies } from "react-cookie";
import useUserSession from "../libs/hooks/useUserSession";
import Loading from "../components/Loading";
import ToastContext from "../libs/contexts/ToastContext";
import Link from "next/link";

export default function SignIn() {
    const toastManager = useContext(ToastContext);
    const { signIn } = useUserSession();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [is_loading, setIsLoading] = useState(false);

    const [, setCookie] = useCookies();

    async function sign_in() {
        if (!is_loading) {
            setIsLoading(true);
            let response = await signIn({ username, password });
            setIsLoading(false);
            if (response.status == "success") {
                toastManager.alertSuccess("Sign in successfuly");
                setCookie("access_token", response.data.access_token);
                location.href = '/';
            } else {
                toastManager.alertError(response.message);
            }
        }
    }

    return (
        <div className='flex flex-col w-1/2 items-center mt-10'>
            <div className="w-full flex flex-col gap-4">
                <div className="w-full">
                    <div>Username:</div>
                    <input className="w-full rounded-xl px-4 py-2 bg-white outline-none focus:bg-purple-200/60 focus:placeholder:text-purple-300" onChange={(evt) => setUsername(evt.target.value)} value={username} placeholder="Username" />
                </div>
                <div>
                    <div>Password:</div>
                    <input 
                    onKeyUp={(e) => { if (e.code == 'Enter') { sign_in() } }} 
                    type={"password"}
                     className="w-full rounded-xl bg-white px-4 py-2 outline-none focus:bg-purple-200/60 focus:placeholder:text-purple-300" onChange={(evt) => setPassword(evt.target.value)} value={password} placeholder="Password" />
                </div>
            </div>
            <div className="w-full flex items-center gap-2 mt-4 text-sm">
                <div>{"Don't have an account?"}</div>
                <Link href={"/sign_up"} className="text-primaryColor font-semibold cursor-pointer active:scale-105 duration-300 select-none">Sign Up</Link>
            </div>
            <div className="w-full flex flex-col items-center mt-8">
                <div className="w-full text-center font-semibold bg-primaryColor rounded-full px-8 py-2 text-gray-50 cursor-pointer hover:bg-secondaryColor active:scale-105 duration-300 select-none" onClick={sign_in}>Sign In</div>
            </div>
            {is_loading && <Loading />}
        </div>
    )
}