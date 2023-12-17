import { FaCamera } from 'react-icons/fa';
import { ChangeEvent, useContext, useRef, useState } from "react";
import SubmitButton, { SubmitButtonResult } from "../components/SubmitButton";
import useRoom from "../libs/hooks/useRoom";
import ToastContext from '../libs/contexts/ToastContext';


export default function CreateRoom(){
    const toastManager = useContext(ToastContext);
    let { room, setRoom, createRoom, upload_profile_image } = useRoom();
    
    const profileImageInput = useRef<HTMLInputElement>(null);
    const [profileImage, setProfileImage] = useState("");

    async function create_room() : Promise<SubmitButtonResult> {
        let room = await createRoom();
        if(profileImageInput.current.value){
            await upload_profile_image(room._id, profileImageInput.current.files[0]);
        }
        toastManager.alertSuccess("Room created successfully.");
        setTimeout(() => { window.location.href = `/rooms/${room._id}`; }, 1000);
        return { status: "success" };
    }

    function readURL(input : HTMLInputElement) : void {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
    
            reader.onload = function (e) {
                setProfileImage(e.target.result.toString());
            }
    
            reader.readAsDataURL(input.files[0]);
        }
    }

    function onChoseImage(ev : ChangeEvent<HTMLInputElement>) : void {
        readURL(ev.target);
    }

    return (
        <div className="w-11/12 flex flex-col items-center">
                    <div className="lg:w-1/2 w-full flex flex-col">
                        <div className="w-full flex flex-col items-center">
                            <div className="w-40 h-40 rounded-full relative my-8">
                                <input ref={profileImageInput} type="file" accept="image/*" hidden onChange={onChoseImage} />
                                <img alt="profile_image" className="h-full w-full rounded-full" src={profileImage ? profileImage : "/profile.png"} />
                                <div onClick={() => profileImageInput.current.click()} className="absolute p-2 rounded-full bg-purple-700 hover:bg-purple-600 cursor-pointer bottom-2 right-2">
                                    <FaCamera className="text-purple-50 lg:text-xs text-lg" />
                                </div>
                            </div>
                            <div className="flex flex-col w-11/12 my-1">
                                <div className="font-mono text-base font-medium text-purple-900 uppercase">Name:</div>
                                <input onChange={(e) => setRoom(state => ({ ...state, name: e.target.value }))} value={room.name} className="font-mono text-base font-medium rounded p-2 outline-none text-purple-600 placeholder:text-purple-300 focus:bg-purple-100" placeholder="Room name" type='text' />
                            </div>
                            <div className="flex flex-col w-11/12 my-1">
                                <div className="font-mono text-base font-medium text-purple-900 uppercase">Bio:</div>
                                <input onChange={(e) => setRoom(state => ({ ...state, bio: e.target.value }))} value={room.bio} className="font-mono text-base font-medium rounded p-2 outline-none text-purple-600 placeholder:text-purple-300 focus:bg-purple-100" placeholder="Room bio" />
                            </div>
                            <div className="flex flex-col w-11/12 my-1">
                                <div className="font-mono text-base font-medium text-purple-900 uppercase">Privacy:</div>
                                <select onChange={(e) => setRoom(state => ({ ...state, is_public: e.target.value == "Public" }))} value={room.is_public ? "Public" : "Private"} className="font-mono text-base font-medium rounded p-2 outline-none text-purple-600 placeholder:text-purple-300 focus:bg-purple-100">
                                    <option>Public</option>
                                    <option>Private</option>
                                </select>
                            </div>
                            <SubmitButton key={crypto.randomUUID()} onClick={create_room} text={"Create"} className={"bg-blue-500 text-purple-50"} wrapperClassName={"mt-8"} />
                        </div> 
                    </div>
                </div>
    )
}