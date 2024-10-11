import { FaSignInAlt,FaUserPlus } from 'react-icons/fa';

export default function _Navigation({ page }){
    return(
        <div className='flex flex-col justify-center w-1/6'>
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
            <Icon className='w-1/6 text-base' />
            <div className='w-5/6 text-base'>{text}</div>
        </a>
    ) : (
        <a href={destination} className='hover:bg-[#d1a2fe55] cursor-pointer flex flex-row w-full items-center text-white px-4 py-2'>
            <Icon className='w-1/6 text-base' />
            <div className='w-5/6 text-base'>{text}</div>
        </a>
    )
}