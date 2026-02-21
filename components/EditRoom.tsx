import { ChangeEvent, useContext, useRef, useState } from "react";
import ToastContext from "../libs/contexts/ToastContext";
import useRoom from "../libs/hooks/useRoom";
import { FaImage } from "react-icons/fa";
import Loading from "./Loading";
import { ModalContext } from "../libs/contexts/ModalContext";

interface EditRoomProps {
    roomId: string;
}

export default function EditRoom({ roomId }: EditRoomProps) {
    const [isLoading, setIsLoading] = useState(false);
    const toastManager = useContext(ToastContext);
    const useModal = useContext(ModalContext);
    const {
        room,
        setRoom,
        resetRoom,
        updateRoom,
        upload_profile_image,
        upload_cover_image,
    } = useRoom(roomId);

    const profileImageInputRef = useRef<HTMLInputElement>(null);
    const coverImageInputRef = useRef<HTMLInputElement>(null);

    function readProfileImageURL(input: HTMLInputElement): void {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                setRoom(state => ({ ...state, profile_image: { url: e.target.result.toString() } }));
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    function readCoverImageURL(input: HTMLInputElement): void {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                setRoom(state => ({ ...state, cover_image: { url: e.target.result.toString() } }));
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    function onSelectProfileImage(ev: ChangeEvent<HTMLInputElement>): void {
        readProfileImageURL(ev.target);
    }

    function onSelectCoverImage(ev: ChangeEvent<HTMLInputElement>): void {
        readCoverImageURL(ev.target);
    }

    async function updateRoomHandler(): Promise<void> {
        setIsLoading(true);

        if (profileImageInputRef.current.value.length > 0) {
            await upload_profile_image(room?._id || "", profileImageInputRef.current.files[0])
        }

        if (coverImageInputRef.current.value.length > 0) {
            await upload_cover_image(room?._id || "", coverImageInputRef.current.files[0])
        }

        const updatedRoom = await updateRoom();
        if (updatedRoom) {
            toastManager.alertSuccess("Room updated successfully.");
            useModal.close();
        } else {
            toastManager.alertError("Something went wrong.");
        }

        setIsLoading(false);
    }

    return (
        <div className='w-full flex flex-col bg-white rounded-xl'>
            <div className='w-full flex flex-col relative'>
                <input ref={profileImageInputRef} onChange={onSelectProfileImage} accept='image/*' type='file' hidden />
                <input ref={coverImageInputRef} onChange={onSelectCoverImage} accept='image/*' type='file' hidden />
                <div className='w-full aspect-[4/1] bg-gray-200 rounded-xl relative'>
                    <img src={(room.cover_image ? room.cover_image.url : '/cover.png')} className='absolute top-0 left-0 w-full h-full object-cover rounded-xl' />
                    <div onClick={() => coverImageInputRef.current.click()} className='absolute bottom-2 right-2 bg-secondaryColor text-white px-8 py-1 text-sm rounded-full flex items-center gap-2 cursor-pointer active:scale-105 duration-300 select-none hover:bg-primaryColor'>
                        <FaImage />
                        <span>Cover Image</span>
                    </div>
                </div>
                <div className='absolute left-1/2 -translate-x-1/2 bottom-0 h-28 w-28 bg-gray-300 rounded-full'>
                    <div className='w-full h-full relative'>
                        <img src={(room.profile_image ? room.profile_image.url : '/profile.png')} className='absolute top-0 left-0 w-full h-full rounded-full object-cover' />
                        <div onClick={() => profileImageInputRef.current.click()} className='absolute bottom-1 right-1 bg-secondaryColor text-white p-2 text-sm rounded-full flex items-center gap-2 cursor-pointer active:scale-105 duration-300 select-none hover:bg-primaryColor'>
                            <FaImage />
                        </div>
                    </div>
                </div>
                <div className='h-8 w-full'></div>
            </div>
            <div className='w-full flex flex-col gap-4 mt-4'>
                <div className="w-full flex flex-col gap-2">
                    <div className="text-black">Name</div>
                    <input value={room.name} onChange={(ev) => setRoom(state => ({ ...state, name: ev.target.value }))} className='bg-gray-100 rounded-lg py-2 px-4 outline-none' type='text' placeholder='Enter Name' />
                </div>
                <div className="w-full flex flex-col gap-2">
                    <div className="text-black">Description</div>
                    <textarea value={room.bio} onChange={(ev) => setRoom(state => ({ ...state, bio: ev.target.value }))} className='bg-gray-100 rounded-xl py-2 px-4 outline-none' placeholder='Enter Description or bio' rows={6} />
                </div>
            </div>
            <div className='w-full flex flex-col gap-4 mt-4'>
                <div className="w-full flex flex-col gap-2">
                    <div className="text-black">Privacy</div>
                    <select value={room.is_public ? "public" : "private"} onChange={(ev) => setRoom(state => ({ ...state, is_public: ev.target.value == "public" }))} className='bg-gray-100 rounded-full py-2 px-4 border-r-8 border-r-gray-100 outline-none'>
                        <option disabled>Select Visibility</option>
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                </div>
                {
                    !room.is_public && (
                        <div className='w-full flex flex-col gap-2'>
                            <div className='text-black'>Password</div>
                            <input value={room.is_public ? "" : room.password} onChange={(ev) => setRoom(state => ({ ...state, password: ev.target.value }))} className={`w-full bg-gray-100 rounded-full py-2 px-4 outline-none ${room.is_public ? "opacity-80 placeholder:text-gray-300" : ""}`} type='password' placeholder={room.is_public ? "Public Rooms Don't have a Password" : "Enter Password"} disabled={room.is_public} />
                        </div>
                    )
                }
            </div>
            <div className='w-full flex flex-col items-end mt-8'>
                <div className="flex flex-row items-center gap-2">
                    <div onClick={resetRoom} className='bg-zinc-200 rounded-full text-black font-semibold text-center py-1 px-16 w-fit cursor-pointer hover:bg-zinc-300 active:scale-105 select-none duration-300'>Cancel</div>
                    <div onClick={updateRoomHandler} className='bg-primaryColor rounded-full text-white font-semibold text-center py-1 px-16 w-fit cursor-pointer hover:bg-secondaryColor active:scale-105 select-none duration-300'>Update</div>
                </div>
            </div>
            {
                isLoading && (
                    <Loading />
                )
            }
        </div>
    )
}