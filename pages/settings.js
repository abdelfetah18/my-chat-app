import Navigation from "../components/Navigation";
import { FaBell } from 'react-icons/fa';

export default function Settings(){
    return(
        <div className='flex flex-row background h-screen w-screen'>
            <Navigation page={'/settings'} />
            <div className='lg:w-5/6 md:w-11/12 w-full bg-[#f1f5fe] rounded-l-3xl flex flex-col px-10 py-4'>
                <div className='w-full flex flex-row justify-end items-center px-4 py-2'>
                    <div className='font-mono text-[#9199a8] mx-1 text-sm'>state:Sale</div>
                    <FaBell className='font-mono text-[#ccd8e8] mx-1 text-base' />
                </div>
                <div className='w-full text-start font-mono font-bold text-2xl px-4 py-2 text-[#02166c]'>Settings</div>
                <div className='flex flex-row w-full'>
                </div>
            </div>
        </div>
    )
}