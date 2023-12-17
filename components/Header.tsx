import { FaBell } from "react-icons/fa";

export default function Header(){
    return (
        <div className='w-11/12 sm:flex flex-row justify-end items-center py-2 hidden'>
            <FaBell className='font-mono text-purple-300 mx-1 text-base' />
            <div className='font-mono text-purple-300 mx-1 text-sm'>Notifications</div>
        </div>
    )
}