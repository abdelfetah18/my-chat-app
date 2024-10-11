import { useContext } from "react";
import { Chat } from "../domain/Chats";
import UserSessionContext from "../libs/contexts/UserSessionContext";
import { useRouter } from "next/router";
import moment from "moment";
import Link from "next/link";

interface ChatCardProps {
    chat: Chat;
};

export default function ChatCard({ chat }: ChatCardProps) {
    const router = useRouter();
    const userSession = useContext(UserSessionContext);

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
        <Link href={`/chat/${chat._id}`} className={'w-full hover:bg-gray-100 cursor-pointer py-3' + (router.query.chat_id == chat._id ? " bg-gray-300/30" : "")}>
            <div className="w-11/12 flex flex-row items-center mx-auto">
                <div className='w-14'>
                    <img alt="profile_image" className='object-cover w-14 h-14 rounded-full border-white border-[3px]' src={chat.target.profile_image != null ? chat.target.profile_image.url : '/profile.png'} />
                </div>
                <div className='flex flex-col flex-grow relative'>
                    <div className='absolute top-0 right-0 text-xs text-gray-400'>{moment(chat.last_message ? chat.last_message._createdAt : chat._createdAt).fromNow()}</div>
                    <div className='flex flex-row w-full'>
                        <div className='flex flex-col w-11/12 px-2'>
                            <div className='text-base text-black'>{chat.target.username || chat.target.name}</div>
                            <div className='text-xs font-medium text-gray-400 w-full whitespace-nowrap overflow-hidden'>{textOverflow(getLastMessage())}</div>
                        </div>
                        {/* TODO: unread messages counter, not available because unread state is not implemented! */}
                        <div className='hidden items-center justify-center w-1/12'>
                            <div className='bg-[#fd476f] rounded-full h-4 w-4 text-center text-xs text-white'>5</div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}