import _Navigation from "../components/_Navigation";
import { useContext, useState } from "react";
import { useCookies } from "react-cookie";
import useUserSession from "../libs/hooks/useUserSession";
import Loading from "../components/Loading";
import { FcGoogle } from "react-icons/fc";
import ToastContext from "../libs/contexts/ToastContext";

const AUTHENTICATION_METHOD = [
    { name: "Google", url: "#" , Icon: FcGoogle },
];

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
            if(response.status == "success"){
                toastManager.alertSuccess("Sign in successfuly");
                setCookie("access_token", response.data.access_token);
                location.href = '/';
            }else{
                toastManager.alertError(response.message);
            }
        }
    }

    return (
        <div className='flex flex-col w-full sm:w-1/2 items-center py-16  rounded-lg'>
            <div className="flex flex-col w-full py-2 px-4">
                <input className="my-1 font-mono px-4 py-2 rounded-lg bg-gray-50 outline-none focus:bg-purple-200/60 focus:placeholder:text-purple-300" onChange={(evt) => setUsername(evt.target.value)} value={username} placeholder="Username" />
                <input onKeyUp={(e) => { if (e.code == 'Enter') { sign_in() } }} type={"password"} className="my-1 bg-gray-50 font-mono px-4 py-2 rounded-lg outline-none focus:bg-purple-200/60 focus:placeholder:text-purple-300" onChange={(evt) => setPassword(evt.target.value)} value={password} placeholder="Password" />
            </div>
            <div className="flex flex-col w-full py-2 px-4 items-center">
                <div className="w-full text-center font-mono font-semibold bg-purple-400 rounded-full px-8 py-2 text-gray-50 cursor-pointer hover:bg-purple-600" onClick={sign_in}>SIGN IN</div>
            </div>
            <div className="w-full flex items-center my-8">
                <div className="flex-grow h-px bg-gray-300"></div>
                <div className="px-4 text-gray-400 text-xs font-semibold">OR</div>
                <div className="flex-grow h-px bg-gray-300"></div>
            </div>
            <div className="w-full flex flex-col items-center">
                {
                    AUTHENTICATION_METHOD.map((method, index) => {
                        return (
                            <div key={index} className="py-2 border-2 rounded-full w-full flex items-center justify-center cursor-pointer text-gray-400  hover:text-purple-50 hover:bg-purple-400 hover:border-purple-400">
                                <method.Icon className="fa-google" />
                                <div className="ml-2 font-semibold">{method.name}</div>
                            </div>
                        )
                    })
                }
            </div>
            {is_loading && <Loading />}
        </div>
    )
}