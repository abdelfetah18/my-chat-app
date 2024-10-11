import ExplorePeople from "../../components/ExplorePeople";
import ExploreFriendRequests from "../../components/ExploreFriendRequests";
import { useState } from "react";
import { FaUserCheck, FaUserFriends, FaUserPlus } from "react-icons/fa";
import AllFriends from "../../components/AllFriends";


type Tab = "suggestions" | "friend requests" | "all friends";
const tabs: Tab[] = ["suggestions", "friend requests", "all friends"];

export default function Friends() {
    const [selectedTab, setSelectedTab] = useState<Tab>("suggestions");

    return (
        <div className='w-full h-full flex py-8 px-2'>
            <div className="w-1/4 flex flex-col">
                <div className="px-6 text-xl font-semibold">Friends</div>
                <div className="w-full px-6 flex flex-col gap-2 py-4">
                    {
                        tabs.map((tab, index) => {
                            const selectTab = () => {
                                setSelectedTab(tab);
                            }

                            return (
                                <div key={index} onClick={selectTab} className={`px-4 py-2 flex items-center gap-2 rounded-lg capitalize cursor-pointer duration-300 hover:bg-gray-200 ${selectedTab == tab ? "bg-gray-200" : ""}`}>
                                    {tab == "all friends" && <FaUserFriends />}
                                    {tab == "suggestions" && <FaUserPlus />}
                                    {tab == "friend requests" && <FaUserCheck />}
                                    <span>{tab}</span>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className="w-3/4 h-full flex flex-col overflow-auto bg-white rounded-lg p-4">
                {selectedTab == "suggestions" && <ExplorePeople />}
                {selectedTab == "friend requests" && <ExploreFriendRequests />}
                {selectedTab == "all friends" && <AllFriends />}
            </div>
        </div>
    )
}