import { useContext } from "react";
import { Chat } from "../domain/Chats";
import UserSessionContext from "../libs/contexts/UserSessionContext";
import { useRouter } from "next/router";

interface ChatCardProps {
    chat: Chat;
};

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function ChatCard({ chat } : ChatCardProps) {
    const router = useRouter();
    const userSession = useContext(UserSessionContext);

    const calcTime = (timestamp: number,diveder: number) : [number, number] =>  {
        return [Math.floor(timestamp / diveder), timestamp % diveder];
    }

    let time_ago = (chat.last_message != null) ? Date.now() - (new Date(chat.last_message.created_at || chat.last_message._createdAt)).getMilliseconds() : 0;
    let [days, r_days] = calcTime(time_ago, 1000 * 60 * 60 * 24);
    let [hours, r_hours] = calcTime(r_days, 1000 * 60 * 60);
    let [minutes] = calcTime(r_hours, 1000 * 60);

    function getLastMessage() {
        if (!chat.last_message)
            return "";
        return chat.last_message.user._id == userSession.user_id ? 'you: ' + (chat.last_message.message_type === "text" ? chat.last_message.message_content : 'send a ' + chat.last_message.message_type) : chat.last_message.user.username + ": " + (chat.last_message.message_type === "text" ? chat.last_message.message_content : 'send a ' + chat.last_message.message_type);
    }

    function textOverflow(text) {
        const TEXT_MAX_LEN = 24;
        if (text.length > TEXT_MAX_LEN) {
            return text.slice(0, TEXT_MAX_LEN) + "...";
        }
        return text;
    }

    return (
        <div onClick={() => window.location.href = '/chat/' + chat._id} className={'w-11/12 hover:shadow-xl cursor-pointer mt-2 flex flex-row bg-[#fafbff] items-center px-4 py-2 rounded-xl'+(router.query.chat_id == chat._id ? " bg-gray-300/30" : "")}>
            <div className='w-14'>
                <img alt="profile_image" className='object-cover w-14 h-14 rounded-full border-white border-[3px]' src={chat.target.profile_image != null ? chat.target.profile_image.url : '/profile.png'} />
            </div>
            <div className='lg:flex flex-col flex-grow md:hidden'>
                <div className='w-full text-end font-mono text-xs font-semibold text-[#a2aac1]'>{(chat.last_message != null) ? ((days > 1) ? ((new Date(chat.last_message._createdAt)).getDate().toString() + ' ' + months[(new Date(chat.last_message.created_at || chat.last_message._createdAt)).getMonth()]) : (hours != 0 ? hours.toString() + ' hours' : minutes.toString() + ' minutes')) : ''}</div>
                <div className='flex flex-row w-full'>
                    <div className='flex flex-col w-11/12 px-2'>
                        <div className='font-mono text-base font-bold text-[#020762]'>{chat.target.username || chat.target.name}</div>
                        <div className='font-mono text-xs font-medium text-[#b7bfcc] w-full whitespace-nowrap overflow-hidden'>{textOverflow(getLastMessage())}</div>
                    </div>
                    {/* TODO: unread messages counter, not available because unread state is not implemented! */}
                    <div className='hidden items-center justify-center w-1/12'>
                        <div className='font-mono bg-[#fd476f] rounded-full h-4 w-4 text-center text-xs text-white'>5</div>
                    </div>
                </div>
            </div>
        </div>
    )
}