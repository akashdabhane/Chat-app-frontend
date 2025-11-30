import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Context';
import { FiMoreVertical } from "react-icons/fi";
import { FiArrowLeft } from "react-icons/fi";

export default function TopUserBar({ setShowChatProfile }) {
    const [otherUser, setOtherUser] = useState({});
    const [isActive, setIsActive] = useState(null);
    const { socket, chatInfo, loggedInUser } = useAuth();
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

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

    const handleBackClick = () => {
        if (isMobile) {
            navigate('/');
        }
    };

    return (
        <div className="flex items-center justify-between p-2 md:pr-3 bg-gray-800 border-b border-gray-700 lg:rounded-tr-2xl">
            <div className="flex items-center space-x-2 md:space-x-3 flex-grow min-w-0">
                {/* Back button for mobile */}
                {isMobile && (
                    <button 
                        onClick={handleBackClick}
                        className="p-1 text-gray-400 hover:text-white active:text-white hover:bg-gray-700 active:bg-gray-600 rounded-full transition-colors flex-shrink-0 touch-manipulation"
                    >
                        <FiArrowLeft className="text-xl" />
                    </button>
                )}
                
                <div
                    className="flex items-center space-x-2 md:space-x-3 cursor-pointer flex-grow min-w-0 p-[0.37rem]"
                    onClick={() => setShowChatProfile(true)}
                >
                    {profileImage ? (
                        <img className='w-9 h-9 md:w-10 md:h-10 rounded-full object-cover flex-shrink-0' src={profileImage} alt="Profile" />
                    ) : (
                        <img className='w-9 h-9 md:w-10 md:h-10 rounded-full object-cover flex-shrink-0' src={displayDefaultPhoto} alt="Profile" />
                    )}

                    <div className='flex-grow min-w-0'>
                        <h3 className="font-bold text-white leading-tight text-sm md:text-base truncate">{displayName || 'Loading...'}</h3>
                        {!chatInfo?.isGroupChat && (
                            <div className='flex items-center space-x-1.5'>
                                {isActive && <span className="block w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>}
                                <span className='text-gray-400 text-xs md:text-sm leading-tight'>{isActive ? 'Active' : "\t"}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <button className="p-2 text-gray-400 hover:text-white active:text-white hover:bg-gray-700 active:bg-gray-600 rounded-full transition-colors flex-shrink-0 touch-manipulation">
                <FiMoreVertical className="text-lg md:text-xl" />
            </button>
        </div>
    )
}



