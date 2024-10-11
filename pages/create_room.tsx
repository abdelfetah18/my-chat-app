import { FaAddressCard, FaCheck, FaGlobeAfrica, FaImage, FaImages, FaLock } from 'react-icons/fa';
import { ChangeEvent, ReactNode, useContext, useEffect, useRef, useState } from "react";
import useRoom from "../libs/hooks/useRoom";
import ToastContext from '../libs/contexts/ToastContext';
import { Room } from '../domain/Rooms';
import { useRouter } from 'next/navigation';
import Loading from '../components/Loading';

export default function CreateRoom() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const selectedStep = steps[currentStepIndex];
    const sliderContainerRef = useRef<HTMLDivElement>(null);
    const toastManager = useContext(ToastContext);
    let { room, setRoom, createRoom, upload_profile_image, upload_cover_image } = useRoom();

    const profileImageInputRef = useRef<HTMLInputElement>(null);
    const coverImageInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (sliderContainerRef.current) {
            const fullWidth = sliderContainerRef.current.scrollWidth;
            const singleItemWidth = fullWidth / steps.length;
            sliderContainerRef.current.scrollTo({ behavior: "smooth", left: singleItemWidth * currentStepIndex });
        }
    }, [currentStepIndex]);

    function validateStep(): boolean {
        if (currentStepIndex == 0) {
            if (room.name.length == 0) {
                toastManager.alertError("Room name input must not be empty");
                return false;
            }
            if (room.bio.length == 0) {
                toastManager.alertError("Room description input must not be empty");
                return false;
            }
        }

        if (currentStepIndex == 2) {
            if (!room.is_public && room.password.length == 0) {
                toastManager.alertError("Private rooms must have a password");
                return false;
            }
        }
        return true;
    }

    async function createRoomHandler(): Promise<void> {
        setIsLoading(true);
        let room = await createRoom();
        if (profileImageInputRef.current.value) {
            await upload_profile_image(room._id, profileImageInputRef.current.files[0]);
        }
        if (coverImageInputRef.current.value) {
            await upload_cover_image(room._id, coverImageInputRef.current.files[0]);
        }
        setIsLoading(false);
        toastManager.alertSuccess("Room created successfully.");
        setTimeout(() => { router.push(`/rooms/${room._id}`); }, 500);
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className='text-3xl font-semibold my-10'>Create Room</div>
            <div className='w-11/12 px-10 py-6 flex bg-white rounded-xl'>
                <div className='w-2/5 flex flex-col'>
                    <div className='w-full flex items-center gap-4 py-4'>
                        {
                            steps.map((step, index) => {
                                const selected = index == currentStepIndex;

                                return (
                                    <div key={index} className='flex items-center gap-2'>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base ${selected ? "bg-primaryColor text-white" : "bg-transparent text-gray-300"}`}>
                                            {step.slug == "Room Details" && <FaAddressCard />}
                                            {step.slug == "Room Appearance" && <FaImages />}
                                            {step.slug == "Room Visibility" && <FaGlobeAfrica />}
                                            {step.slug == "Review and Create" && <FaCheck />}
                                        </div>
                                        {
                                            selected && (
                                                <div className='flex flex-col duration-300'>
                                                    <div className='text-xs duration-300'>
                                                        {`Step ${index + 1}/${steps.length}`}
                                                    </div>
                                                    <div className='text-sm text-primaryColor font-semibold duration-300'>{step.slug}</div>
                                                </div>
                                            )
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className='w-full flex flex-col gap-2'>
                        <div className='text-xl font-bold text-black'>{selectedStep.title}</div>
                        <div className='text-xs text-gray-400 max-w-sm'>{selectedStep.description}</div>
                    </div>
                </div>
                <div className='w-3/5 flex flex-col'>
                    <div ref={sliderContainerRef} className='w-full flex overflow-hidden'>
                        <SliderWrapper selected={selectedStep.slug == "Room Details"}><RoomDetails useRoom={[room, setRoom]} /></SliderWrapper>
                        <SliderWrapper selected={selectedStep.slug == "Room Appearance"}><RoomApearance useRoom={[room, setRoom]} profileImageInputRef={profileImageInputRef} coverImageInputRef={coverImageInputRef} /></SliderWrapper>
                        <SliderWrapper selected={selectedStep.slug == "Room Visibility"}><RoomVisibility useRoom={[room, setRoom]} /></SliderWrapper>
                        <SliderWrapper selected={selectedStep.slug == "Review and Create"}><RoomReview room={room} /></SliderWrapper>
                    </div>

                    <div className='w-full flex items-center justify-end mb-4'>
                        <div className='flex items-center gap-2'>
                            {
                                currentStepIndex > 0 && (
                                    <div onClick={() => { setCurrentStepIndex(state => state - 1); }} className='cursor-pointer duration-300 active:scale-105 px-16 py-1 rounded-full bg-gray-200 text-black'>Prev</div>
                                )
                            }
                            {
                                currentStepIndex < (steps.length - 1) && (
                                    <div onClick={() => { if (validateStep()) { setCurrentStepIndex(state => state + 1); } }} className='cursor-pointer duration-300 active:scale-105 px-16 py-1 rounded-full bg-primaryColor text-white'>Next</div>
                                )
                            }

                            {
                                currentStepIndex == (steps.length - 1) && (
                                    <div onClick={createRoomHandler} className='cursor-pointer duration-300 active:scale-105 px-16 py-1 rounded-full bg-primaryColor text-white'>Create</div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>

            {
                isLoading && (
                    <Loading />
                )
            }
        </div >
    )
}

interface SliderWrapperProps { children: ReactNode; selected: boolean; };
function SliderWrapper({ children, selected }: SliderWrapperProps) {
    return (
        <div className="min-w-full duration-300" style={{ opacity: selected ? 1 : 0 }}>
            {children}
        </div>
    )
}

interface RoomDetailsProps {
    useRoom: [Room, React.Dispatch<React.SetStateAction<Room>>];
};

function RoomDetails({ useRoom }: RoomDetailsProps) {
    const [room, setRoom] = useRoom;

    return (
        <div className='w-full flex flex-col gap-2'>
            <input value={room.name} onChange={(ev) => setRoom(state => ({ ...state, name: ev.target.value }))} className='bg-gray-100 rounded-full py-2 px-4 text-sm outline-none' type='text' placeholder='Enter Name' />
            <textarea value={room.bio} onChange={(ev) => setRoom(state => ({ ...state, bio: ev.target.value }))} className='bg-gray-100 rounded-xl py-2 px-4 text-sm outline-none' placeholder='Enter Description or bio' rows={6} />
        </div>
    )
}

interface RoomApearanceProps {
    useRoom: [Room, React.Dispatch<React.SetStateAction<Room>>];
    profileImageInputRef: React.MutableRefObject<HTMLInputElement>;
    coverImageInputRef: React.MutableRefObject<HTMLInputElement>;
};

function RoomApearance({ useRoom, profileImageInputRef, coverImageInputRef }: RoomApearanceProps) {
    const [room, setRoom] = useRoom;

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

    return (
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
    )
}

interface RoomVisibilityProps {
    useRoom: [Room, React.Dispatch<React.SetStateAction<Room>>];
};
function RoomVisibility({ useRoom }: RoomVisibilityProps) {
    const [room, setRoom] = useRoom;

    return (
        <div className='w-full flex flex-col gap-4'>
            <select value={room.is_public ? "public" : "private"} onChange={(ev) => setRoom(state => ({ ...state, is_public: ev.target.value == "public" }))} className='bg-gray-100 rounded-full py-2 px-4 text-sm border-r-8 border-r-gray-100 outline-none'>
                <option disabled>Select Visibility</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
            </select>
            <div className='w-full flex flex-col gap-2'>
                <div className='text-sm w-full'>Password:</div>
                <input value={room.is_public ? "" : room.password} onChange={(ev) => setRoom(state => ({ ...state, password: ev.target.value }))} className={`w-full bg-gray-100 rounded-full py-2 px-4 text-sm outline-none ${room.is_public ? "opacity-80 placeholder:text-gray-300" : ""}`} type='password' placeholder={room.is_public ? "Public Rooms Don't have a Password" : "Enter Password"} disabled={room.is_public} />
            </div>
        </div>
    )
}

interface RoomReviewProps {
    room: Room;
};
function RoomReview({ room }: RoomReviewProps) {
    return (
        <div className='w-full flex flex-col'>
            <div className='w-full flex flex-col relative'>
                <div className='w-full aspect-[4/1] bg-gray-200 rounded-xl relative'>
                    <img src={(room.cover_image ? room.cover_image.url : '/cover.png')} className='absolute top-0 left-0 w-full h-full object-cover rounded-xl' />
                </div>
                <div className='absolute left-4 bottom-0 h-28 w-28 bg-gray-300 rounded-full'>
                    <div className='w-full h-full relative'>
                        <img src={(room.profile_image ? room.profile_image.url : '/profile.png')} className='absolute top-0 left-0 w-full h-full rounded-full object-cover' />
                    </div>
                </div>
                <div className='h-8 w-full'></div>
            </div>
            <div className="font-medium text-black text-base w-full mt-1">{room.name}</div>
            <div className="text-gray-400 text-xs w-full">{room.bio}</div>
            <div className="text-black text-xs flex items-center gap-1 my-2">
                {room.is_public ? (<FaGlobeAfrica />) : (<FaLock />)}
                {room.is_public ? "Public" : "Private"}
            </div>
            <div className='flex flex-col'>
                {
                    !room.is_public && (<div className='text-sm'>Password: {room.password}</div>)
                }
            </div>
        </div>
    )
}

type Slug = "Room Details" | "Room Appearance" | "Room Visibility" | "Review and Create";
interface Step {
    slug: Slug;
    title: string;
    description: string;
};

const steps: Step[] = [
    { title: "Enter Room Details", description: "Provide the name and a short description for your room to help others understand its purpose.", slug: "Room Details" },
    { title: "Customize Room Appearance", description: "Upload a profile image and a cover image to give your room a unique look and feel.", slug: "Room Appearance" },
    { title: "Set Room Visibility", description: "Choose whether to make your room public or private. You can set a password for private rooms.", slug: "Room Visibility" },
    { title: "Review and Create Room", description: "Review all the information you've entered. When you're ready, click 'Create Room' to finalize the setup.", slug: "Review and Create" },
];