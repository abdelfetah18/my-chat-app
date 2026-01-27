import RecentChats from "./RecentChats";

export default function ChatLayout({ children }) {
    return (
        <div className='flex flex-row w-full flex-grow overflow-auto'>
            <RecentChats />
            {children}
        </div>
    )
}