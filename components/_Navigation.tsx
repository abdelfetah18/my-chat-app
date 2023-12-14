import { FaSignInAlt,FaUserPlus } from 'react-icons/fa';

export default function _Navigation({ page }){
    return(
        <div className='lg:flex md:flex flex-col md:w-1/12 lg:w-1/6 hidden'>
            <div className='md:opacity-0 w-full lg:flex flex-col items-center p-10'>
                <img alt="profile_image" className='w-16 h-16 rounded-full border-white border-[3px] shadow-black shadow-2xl' src='/profile.png' />
                <div className='font-mono font-medium text-white text-lg py-2 px-4'>Abdelfetah</div>
            </div>
            <div className='flex flex-col w-full items-center'>
                <Button Icon={FaSignInAlt} text='Sign In' page={page} destination='/sign_in' />
                <Button Icon={FaUserPlus} text='Sign Up' page={page} destination='/sign_up' />
            </div>
        </div>
    )
}

const Button = ({ Icon,text,page,destination }) => {
    return (page === destination) ? (
        <a href={destination} className='hover:bg-[#d1a2fe55] cursor-pointer flex flex-row w-full items-center text-white px-4 py-2 border-[#d1a2fe] border-l-[4px] bg-[#d1a2fe55]'>
            <Icon className='lg:w-1/6 md:w-full text-base' />
            <div className='md:hidden lg:block lg:w-5/6 font-mono text-base'>{text}</div>
        </a>
    ) : (
        <a href={destination} className='hover:bg-[#d1a2fe55] cursor-pointer flex flex-row w-full items-center text-white px-4 py-2'>
            <Icon className='lg:w-1/6 md:w-full text-base' />
            <div className='md:hidden lg:block lg:w-5/6 font-mono text-base'>{text}</div>
        </a>
    )
}