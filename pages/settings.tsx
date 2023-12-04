import Navigation from "../components/Navigation";
import { FaBell } from 'react-icons/fa';
import { Cookies } from "react-cookie";

export default function Settings(){
    let cookies = new Cookies();

    function Logout(){
        localStorage.clear();
        cookies.remove('access_token');
        window.location.href = "/sign_in";
    }
    
    return(
        <div className='flex flex-col md:flex-row background h-screen w-screen'>
            <Navigation page={'/settings'} />
            <div className='lg:w-5/6 md:w-11/12 w-full flex-grow bg-[#f1f5fe] md:rounded-l-3xl flex flex-col items-center py-4'>
                <div className='w-11/12 flex flex-row justify-end items-center px-4 py-2'>
                    <FaBell className='font-mono text-[#ccd8e8] mx-1 text-base' />
                    <div className='font-mono text-[#9199a8] mx-1 text-sm'>Notifications</div>
                </div>
                <div className='w-11/12 text-start font-mono font-bold text-2xl px-4 py-2 text-[#02166c]'>Settings</div>
                <div className='flex flex-row w-11/12'>
                    <div className="flex flex-col items-center md:w-1/2 w-full">
                        <div className="w-11/12 font-mono text-lg font-semibold text-[#02166c]">Profile</div>
                        <div className="w-11/12 flex flex-col items-center my-2">
                            <div onClick={Logout} className="cursor-pointer w-full text-center py-1 bg-blue-500 rounded-lg font-semibold text-white">Logout</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}