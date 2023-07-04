import { useState } from 'react';
import { FaHome,FaPlus,FaCommentAlt,FaComments,FaCog, FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { motion, useAnimation } from 'framer-motion';

export default function Navigation({ page }){
    let [menuOpen,setMenuOpen] = useState(false);
    let menuAnimation = useAnimation();

    function toggleMenu(){
        if(menuOpen){
            menuAnimation.start({
                height: 0,
                opacity: 0,
                transition: {
                    duration: 0.5
                }
            }).then(() => {
                menuAnimation.set({
                    display: "none"
                })
                setMenuOpen(false);
            });
        }else{
            menuAnimation.start({
                display:"flex",
                height: "100%",
                transition: {
                    duration: 0.5
                }
            }).then(() => {
                
                setMenuOpen(true);
            });
            menuAnimation.start({
                opacity: 1,
                transition: {
                    delay:0.3,
                    duration: 0.3
                }
            });
        }
    }

    return(
        <div className='flex flex-col md:w-1/12 lg:w-1/6 w-full sm:flex-grow'>
            <div className='hidden sm:flex md:opacity-0 w-full lg:flex flex-col items-center p-10'>
                <img className='w-16 h-16 rounded-full border-white border-[3px] shadow-black shadow-2xl' src='/profile.jpeg' />
                <div className='font-mono font-medium text-white text-lg py-2 px-4'>Abdelfetah</div>
            </div>
            <motion.div animate={menuAnimation} className='sm:flex flex-col w-full items-center h-0 opacity-0 sm:h-full sm:opacity-100 hidden'>
                <Button Icon={FaHome} text='Home' page={page} destination='/' />
                <Button Icon={FaPlus} text='Create room' page={page} destination='/create_room' />
                <Button Icon={FaCommentAlt} text='Chat' page={page} destination='/chat' />
                <Button Icon={FaComments} text='Rooms' page={page} destination='/rooms' />
                <Button Icon={FaCog} text='Settings' page={page} destination='/settings' />
            </motion.div>
            <div onClick={toggleMenu} className='flex flex-col items-center py-2 bg-[#d1a2fe55] sm:hidden'>
                { menuOpen ? (<FaAngleUp className='text-white text-base'/>) : (<FaAngleDown className='text-white text-base'/>) }
            </div>
        </div>
    )
}

const Button = ({ Icon,text,page,destination }) => {
    return (page === destination) ? (
        <a href={destination} className='hover:bg-[#d1a2fe55] cursor-pointer flex flex-row w-full items-center text-white px-4 py-2 border-[#d1a2fe] border-l-[4px] bg-[#d1a2fe55]'>
            <Icon className='lg:w-1/6 md:w-full text-sm sm:text-base' />
            <div className='md:hidden lg:block lg:w-5/6 font-mono px-2 sm:px-0 text-sm sm:text-base'>{text}</div>
        </a>
    ) : (
        <a href={destination} className='hover:bg-[#d1a2fe55] cursor-pointer flex flex-row w-full items-center text-white px-4 py-2'>
            <Icon className='lg:w-1/6 md:w-full text-sm sm:text-base' />
            <div className='md:hidden lg:block lg:w-5/6 font-mono px-2 sm:px-0 text-sm sm:text-base'>{text}</div>
        </a>
    )
}