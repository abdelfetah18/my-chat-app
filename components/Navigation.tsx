import Link from 'next/link';
import { FaPlus, FaCommentAlt, FaComments, FaCog, FaCompass, FaUsers, FaHome } from 'react-icons/fa';

export default function Navigation({ page }) {
    return (
        <div className='flex flex-col justify-center w-1/6 static bottom-0 z-10 bg-transparent flex-grow'>
            <div className='flex flex-col justify-center w-full items-center'>
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

const Button = ({ Icon, text, page, destination }) => {
    const styles = {
        container: "hover:bg-[#d1a2fe55] cursor-pointer w-full flex-0 flex flex-row items-center justify-center text-purple-50 px-4 py-2",
        icon: 'w-1/6 text-base',
        text: 'block w-5/6 px-0 text-base'
    };

    const selected_styles = {
        container: `${styles.container} border-[#d1a2fe]  border-l-4 bg-[#d1a2fe55]`,
        icon: `${styles.icon}`,
        text: `${styles.text}`,
    }

    return (page === destination) ? (
        <Link href={destination} className={selected_styles.container}>
            <Icon className={selected_styles.icon} />
            <div className={selected_styles.text}>{text}</div>
        </Link>
    ) : (
        <Link href={destination} className={styles.container}>
            <Icon className={selected_styles.icon} />
            <div className={selected_styles.text}>{text}</div>
        </Link>
    )
}