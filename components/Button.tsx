import { IconType } from "react-icons/lib";

interface ButtonProps {
    Icon: IconType;
    bg_color: string;
    icon_color: string;
    onClick: () => any
};

export default function Button({ Icon, bg_color, icon_color, onClick } : ButtonProps){
    return (
        <div onClick={onClick} className={'absolute z-0 bottom-0 right-0 p-2 rounded-full shadow-xl m-2 cursor-pointer hover:bg-blue-700'} style={{ backgroundColor: bg_color }}>
            <Icon style={{ color: icon_color }} />
        </div>
    )
}