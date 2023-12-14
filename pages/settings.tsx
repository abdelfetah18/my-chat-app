import { Cookies } from "react-cookie";

export default function Settings() {
    let cookies = new Cookies();

    function Logout() {
        localStorage.clear();
        cookies.remove('access_token');
        window.location.href = "/sign_in";
    }

    return (
        <div className='flex flex-row w-11/12'>
            <div className="flex flex-col items-center md:w-1/2 w-full">
                <div className="w-11/12 font-mono text-lg font-semibold text-[#02166c]">Profile</div>
                <div className="w-11/12 flex flex-col items-center my-2">
                    <div onClick={Logout} className="cursor-pointer w-full text-center py-1 bg-purple-500 hover:bg-purple-700 rounded-lg font-semibold text-white">Logout</div>
                </div>
            </div>
        </div>
    )
}