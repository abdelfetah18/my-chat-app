import { Icon } from "@iconify/react";
import Link from "next/link";

export default function NavigationItem({ icon, text, page, destination, isExpanded = true }) {
    return (
        <Link
            href={destination}
            className={`hover:bg-[#d1a2fe55] cursor-pointer w-full flex-0 flex flex-row items-center justify-center text-purple-50 px-4 py-2 gap-2 ${page === destination ? 'bg-[#d1a2fe55] relative' : ''}`}
        >
            {page === destination && (<div className='w-1 h-full bg-[#d1a2fe] absolute left-0'></div>)}
            <Icon icon={icon} className={isExpanded ? 'text-lg' : 'text-xl'} />
            {isExpanded && <div className={'block flex-grow px-0 text-base'}>{text}</div>}
        </Link>
    );
}