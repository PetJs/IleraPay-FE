import type { CardComponentProps } from "@/lib/types";
import { Button } from "../ui/button";

const CardComponent: React.FC<CardComponentProps> = ({title, icon, openIcon, description, bgColor, onClick }) => {
    return (
        <div className={`h-[25vh] p-4 rounded-4xl ${bgColor} flex flex-col justify-between  text-white relative`}>
            <div className="flex items-center justify-between">
                {icon && <div className="w-14 h-14 rounded-full bg-black/10 flex justify-center items-center">{icon}</div>}
                {openIcon && <div className=" flex justify-center items-center">{openIcon}</div>}
            </div>
            
            <p className="mb-2">{description}</p>
            
            <div className="">
                {title && <h2>{title}</h2>}
                {onClick && <div className=""><Button onClick={onClick} className="flex items-center  w-full rounded-4xl bg-[#F28500]"><span className="text-white text-center">View</span></Button> </div>}
            </div>
        </div>
    );
}

export default CardComponent;