import { Icon } from "@iconify/react";

interface CardBoxProps {
    title: string;
    value: string;
    icon?: string;
    textColor: string;
    iconColor: string;
}

export default function CardBox({ title, value, icon = null, textColor, iconColor }: CardBoxProps) {
    return (
        <div className='flex-1 flex flex-col items-center'>
            {icon && <Icon icon={icon} style={{ color: iconColor, fontSize: 20 }} />}
            <div className='text-gray-400' style={{ color: iconColor }}>{title}</div>
            <div className='text-lg font-medium' style={{ color: textColor }}>{value}</div>
        </div>
    )
}