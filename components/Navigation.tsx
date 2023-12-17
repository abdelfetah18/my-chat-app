import { FaHome,FaPlus,FaCommentAlt,FaComments,FaCog, FaCompass, FaUsers } from 'react-icons/fa';

export default function Navigation({ page }){
    return(
        <div className='flex flex-col sm:w-1/12 lg:w-1/6 sm:static fixed bottom-0 z-10 sm:bg-transparent bg-purple-400 w-full sm:flex-grow'>
            <div className='hidden sm:flex sm:opacity-0 w-full lg:flex flex-col items-center p-10'>
                <img alt="profile_image" className='w-16 h-16 rounded-full border-white border-[3px] shadow-black shadow-2xl' src='/profile.png' />
                <div className='font-mono font-medium text-white text-lg py-2 px-4'>Abdelfetah</div>
            </div>
            <div className='sm:flex sm:flex-col flex justify-center w-full items-center sm:opacity-100'>
                <Button Icon={FaHome} text='Home' page={page} destination='/' />
                <Button Icon={FaCompass} text='Explore' page={page} destination='/explore' />
                <Button Icon={FaPlus} text='Create room' page={page} destination='/create_room' />
                <Button Icon={FaCommentAlt} text='Chat' page={page.startsWith("/chat") ? '/chat' : page} destination='/chat' />
                <Button Icon={FaComments} text='Rooms' page={page.startsWith("/rooms") ? '/rooms' : page} destination='/rooms' />
                <Button Icon={FaUsers} text='Friends' page={page} destination='/friends' />
                <Button Icon={FaCog} text='Settings' page={page} destination='/settings' />
            </div>
        </div>
    )
}

const Button = ({ Icon,text,page,destination }) => {
    const styles = {
        container: "hover:bg-[#d1a2fe55] cursor-pointer sm:w-full sm:flex-0 flex-1 flex flex-row items-center justify-center text-purple-50 sm:px-4 sm:py-2 py-4",
        icon: 'lg:w-1/6 md:w-full text-xl sm:text-base',
        text: 'hidden lg:block lg:w-5/6 font-mono px-2 sm:px-0 text-sm sm:text-base'
    };

    const selected_styles = {
        container: `${styles.container} border-[#d1a2fe] border-t-[4px] sm:border-t-0 sm:border-l-[4px] bg-[#d1a2fe55]`,
        icon: `${styles.icon}`,
        text: `${styles.text}`,
    }

    return (page === destination) ? (
        <a href={destination} className={selected_styles.container}>
            <Icon className={selected_styles.icon} />
            <div className={selected_styles.text}>{text}</div>
        </a>
    ) : (
        <a href={destination} className={styles.container}>
            <Icon className={selected_styles.icon} />
            <div className={selected_styles.text}>{text}</div>
        </a>
    )
}