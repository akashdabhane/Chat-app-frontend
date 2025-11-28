import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/Context';
import { FiMoreVertical } from "react-icons/fi";

export default function TopUserBar({ setShowChatProfile }) {
    const [otherUser, setOtherUser] = useState({});
    const [isActive, setIsActive] = useState(null);
    const { socket, chatInfo, loggedInUser } = useAuth();

    useEffect(() => {
        if (!chatInfo?.isGroupChat) {
            setOtherUser(chatInfo?.participants?.find(item => item._id !== loggedInUser._id));
        }
    }, [chatInfo, loggedInUser]);

    useEffect(() => {
        socket.on("receive-active-flag", (data) => {
            setIsActive(true);
        });

        socket.on("receive-inactive-flag", (data) => {
            setIsActive(false);
        });
    }, [socket, isActive])

    const displayName = chatInfo?.isGroupChat ? chatInfo?.name : otherUser?.name;
    const profileImage = chatInfo?.isGroupChat ? chatInfo?.profileImage : otherUser?.profileImage;
    const displayDefaultPhoto = 'https://res.cloudinary.com/domlldpib/image/upload/v1727176756/chat-app-m/ggaqjqfhcnmz6nhnexrm.png';

    return (
        <div className="flex items-center justify-between p-2 pr-3 bg-gray-800 border-b border-gray-700 lg:rounded-tr-2xl">
            <div
                className="flex items-center space-x-3 cursor-pointer flex-grow p-[0.37rem]"
                onClick={() => setShowChatProfile(true)}
            >
                {profileImage ? (
                    <img className='w-10 h-10 rounded-full object-cover' src={profileImage} alt="Profile" />
                ) : (
                    <img className='w-10 h-10 rounded-full object-cover' src={displayDefaultPhoto} alt="Profile" />
                )}

                <div className='flex-grow'>
                    <h3 className="font-bold text-white leading-tight">{displayName || 'Loading...'}</h3>
                    {!chatInfo?.isGroupChat && (
                        <div className='flex items-center space-x-1.5'>
                            {isActive && <span className="block w-2 h-2 bg-green-500 rounded-full"></span>}
                            <span className='text-gray-400 text-sm leading-tight'>{isActive ? 'Active' : "\t"}</span>
                        </div>
                    )}
                </div>
            </div>

            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors flex-shrink-0">
                <FiMoreVertical />
            </button>
        </div>
    )
}



