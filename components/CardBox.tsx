import { IconType } from "react-icons/lib";

interface CardBoxProps {
    title: string;
    value: string;
    Icon?: IconType;
    textColor: string;
    iconColor: string;
}

export default function CardBox({ title, value, Icon=null, textColor, iconColor } : CardBoxProps){
    return (
        <div className='flex-1 flex flex-col items-center'>
            {Icon && <Icon style={{ color: iconColor }} />}
            <div className='text-xs text-gray-400 mb-2' style={{ color: iconColor }}>{title}</div>
            <div className={'sm:text-lg text-sm font-medium'} style={{ color: textColor }}>{value}</div>
        </div>
    )
}