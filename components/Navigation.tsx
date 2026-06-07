import Link from 'next/link';
import { useContext, useState } from 'react';
import { FaPlus, FaCommentAlt, FaComments, FaCog, FaCompass, FaUsers, FaHome } from 'react-icons/fa';
import { TbLayoutSidebarLeftExpand, TbLayoutSidebarRightExpand } from "react-icons/tb";
import UserContext from '../libs/contexts/UserContext';

export default function Navigation({ page }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const { username, profile_image } = useContext(UserContext);

    return (
        <div className={`flex flex-col justify-between ${isExpanded ? "w-1/6" : "w-16"} static bottom-0 z-10 bg-transparent duration-300`}>
            <div></div>
            <div className='flex flex-col justify-center w-full items-center'>
                <Button Icon={FaHome} text='Home' page={page} destination='/' isExpanded={isExpanded} />
                <Button Icon={FaCompass} text='Explore' page={page} destination='/explore' isExpanded={isExpanded} />
                <Button Icon={FaPlus} text='Create room' page={page} destination='/create_room' isExpanded={isExpanded} />
                <Button Icon={FaCommentAlt} text='Chat' page={page.startsWith("/chat") ? '/chat' : page} destination='/chat' isExpanded={isExpanded} />
                <Button Icon={FaComments} text='Rooms' page={page.startsWith("/rooms") ? '/rooms' : page} destination='/rooms' isExpanded={isExpanded} />
                <Button Icon={FaUsers} text='Friends' page={page} destination='/friends' isExpanded={isExpanded} />
                <Button Icon={FaCog} text='Settings' page={page} destination='/settings' isExpanded={isExpanded} />
            </div>
            <div className={`w-full flex items-center gap-2 justify-between p-2 ${isExpanded ? 'flex-row' : 'flex-col'}`}>
                <div className='flex-grow flex items-center gap-2'>
                    <img alt="profile_image" className='object-cover w-8 h-8 rounded-full' src={profile_image ? profile_image.url : "/profile.png"} />
                    {isExpanded && <div className='text-purple-50'>{username}</div>}
                </div>
                <div
                    className={`text-purple-50 hover:bg-[#d1a2fe55] text-xl cursor-pointer p-2 rounded-full ${isExpanded ? '' : 'bg-[#d1a2fe55]'}`}
                    onClick={() => {
                        setIsExpanded(state => !state);
                    }}
                >
                    {isExpanded ? <TbLayoutSidebarRightExpand /> : <TbLayoutSidebarLeftExpand />}
                </div>
            </div>
        </div>
    )
}

const Button = ({ Icon, text, page, destination, isExpanded }) => {
    const styles = {
        container: "hover:bg-[#d1a2fe55] cursor-pointer w-full flex-0 flex flex-row items-center justify-center text-purple-50 px-4 py-2 gap-2",
        icon: isExpanded ? 'text-base' : 'text-xl',
        text: 'block flex-grow px-0 text-base'
    };

    const selected_styles = {
        container: `${styles.container} border-[#d1a2fe]  border-l-4 bg-[#d1a2fe55]`,
        icon: `${styles.icon}`,
        text: `${styles.text}`,
    }

    return (
        <Link href={destination} className={page === destination ? selected_styles.container : styles.container}>
            <Icon className={styles.icon} />
            {isExpanded && <div className={styles.text}>{text}</div>}
        </Link>
    )
}