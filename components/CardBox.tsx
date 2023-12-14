import { IconType } from "react-icons/lib";

interface CardBoxProps {
    title: string;
    value: string;
    Icon?: IconType;
    color: string;
}

export default function CardBox({ title, value, Icon=null, color } : CardBoxProps){
    return (
        <div className='flex-1 flex flex-col items-center hover:bg-gray-100 rounded-lg cursor-pointer'>
            {Icon && <Icon className="text-gray-400" />}
            <div className='text-xs text-gray-400 mb-2'>{title}</div>
            <div className={'text-lg font-medium'} style={{ color }}>{value}</div>
        </div>
    )
}