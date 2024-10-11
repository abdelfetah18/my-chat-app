import { useContext, useRef, useState } from "react";
import { Cookies } from "react-cookie";
import { FaCamera, FaEdit, FaSignOutAlt } from "react-icons/fa";
import useUser from "../libs/hooks/useUser";
import Loading from "../components/Loading";
import ToastContext from "../libs/contexts/ToastContext";

type Tab = "edit profile";
const tabs: Tab[] = ["edit profile"];


export default function Settings() {
    const [selectedTab, setSelectedTab] = useState<Tab>("edit profile");
    const cookies = new Cookies();

    function LogoutHandler() {
        localStorage.clear();
        cookies.remove('access_token');
        window.location.href = "/sign_in";
    }

    return (
        <div className='w-full h-full flex py-8 px-2'>
            <div className="w-1/4 flex flex-col">
                <div className="px-6 text-xl font-semibold">Settings</div>
                <div className="w-full px-6 flex flex-col gap-2 py-4">
                    {
                        tabs.map((tab, index) => {
                            const selectTab = () => {
                                setSelectedTab(tab);
                            }

                            return (
                                <div key={index} onClick={selectTab} className={`px-4 py-2 flex items-center gap-2 rounded-lg capitalize cursor-pointer duration-300 hover:bg-gray-200 ${selectedTab == tab ? "bg-gray-200" : ""}`}>
                                    {tab == "edit profile" && <FaEdit />}
                                    <span>{tab}</span>
                                </div>
                            )
                        })
                    }
                    <div onClick={LogoutHandler} className="px-4 py-2 flex items-center gap-2 rounded-lg cursor-pointer duration-300 hover:bg-gray-200 text-red-600">
                        <FaSignOutAlt />
                        <span>Log out</span>
                    </div>
                </div>
            </div>
            <div className="w-3/4 h-full flex flex-col items-center overflow-auto bg-white rounded-lg p-4">
                {selectedTab == "edit profile" && <EditProfile />}
            </div>
        </div>
    );
}

function EditProfile() {
    const toastManager = useContext(ToastContext);
    const [isLoading, setIsLoading] = useState(false);
    const { user, setUser, upload_profile_image, updateUser } = useUser();
    const profileImageRef = useRef<HTMLInputElement>(null);

    function updateProfileImage() {
        if (profileImageRef.current) {
            profileImageRef.current.click();
        }
    }

    async function onProfileImageChange(evt: React.ChangeEvent) {
        if (evt.target instanceof HTMLInputElement) {
            setIsLoading(true);
            await upload_profile_image(evt.target.files[0]);
            toastManager.alertSuccess("Profile Image Updated Successfully");
            setIsLoading(false);
        }
    }

    async function updateUserHandler() {
        setIsLoading(true);
        await updateUser();
        toastManager.alertSuccess("User Updated Successfully");
        setIsLoading(false);
    }

    return (
        <div className="w-2/3 flex flex-col gap-8 py-8">
            <div className="text-xl font-semibold">Edit Profile:</div>
            <div className="w-full flex flex-col">
                <div className="text-lg py-2">Profile Image:</div>
                <div className="relative w-20 h-20 rounded-full">
                    <img src={user.profile_image?.url || "/profile.png"} className="w-full h-full rounded-full object-cover" />
                    <div onClick={updateProfileImage} className="absolute bottom-0 right-0 bg-primaryColor p-2 rounded-full text-white cursor-pointer active:scale-105 duration-300 select-none hover:bg-secondaryColor">
                        <FaCamera />
                    </div>
                    <input onChange={onProfileImageChange} ref={profileImageRef} type='file' hidden />
                </div>
            </div>
            <div className="w-full flex flex-col">
                <div className="text-lg py-2">Profile Details:</div>
                <div className="w-full flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <div>Username:</div>
                        <input
                            value={user.username}
                            onChange={(ev) => setUser(state => ({ ...state, username: ev.target.value }))}
                            type="text" placeholder="Enter a username" className="w-full px-4 py-2 rounded-xl border" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div>Bio:</div>
                        <textarea
                            value={user.bio}
                            onChange={(ev) => setUser(state => ({ ...state, bio: ev.target.value }))}
                            rows={3} placeholder="Enter a bio" className="w-full px-4 py-2 rounded-xl border" />
                    </div>
                </div>
            </div>
            <div className="w-full flex items-center justify-end gap-2">
                <div onClick={updateUserHandler} className="rounded-full w-40 text-center py-2 bg-primaryColor text-white font-semibold select-none cursor-pointer active:scale-105 duration-300 hover:bg-secondaryColor">Save</div>
            </div>
            {isLoading && (<Loading />)}
        </div>
    )
}