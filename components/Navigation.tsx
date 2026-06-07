import { useContext, useState } from 'react';
import { Icon } from '@iconify/react';
import UserContext from '../libs/contexts/UserContext';
import NavigationItem from './NavigationItem';

export default function Navigation({ page }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const { username, profile_image } = useContext(UserContext);

    return (
        <div className={`flex flex-col justify-between ${isExpanded ? "w-1/6" : "w-16"} static bottom-0 z-10 bg-transparent duration-300`}>
            <div></div>
            <div className='flex flex-col justify-center w-full items-center'>
                <NavigationItem icon={'lucide:home'} text='Home' page={page} destination='/' isExpanded={isExpanded} />
                <NavigationItem icon={'lucide:compass'} text='Explore' page={page} destination='/explore' isExpanded={isExpanded} />
                <NavigationItem icon={'lucide:plus'} text='Create room' page={page} destination='/create_room' isExpanded={isExpanded} />
                <NavigationItem icon={'lucide:message-circle-more'} text='Chat' page={page.startsWith("/chat") ? '/chat' : page} destination='/chat' isExpanded={isExpanded} />
                <NavigationItem icon={'lucide:messages-square'} text='Rooms' page={page.startsWith("/rooms") ? '/rooms' : page} destination='/rooms' isExpanded={isExpanded} />
                <NavigationItem icon={'lucide:users'} text='Friends' page={page} destination='/friends' isExpanded={isExpanded} />
                <NavigationItem icon={'lucide:cog'} text='Settings' page={page} destination='/settings' isExpanded={isExpanded} />
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
                    {isExpanded ? <Icon icon='lucide:panel-right-open' /> : <Icon icon='lucide:panel-right-close' />}
                </div>
            </div>
        </div>
    )
}
