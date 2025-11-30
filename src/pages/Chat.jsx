import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LeftPanel from '../components/LeftPanel';
import '../styles/index.css';
import UserProfilePopup from '../popups/UserProfilePopup';
import ChatProfilePopup from '../popups/ChatProfilePopup';
import CreateChatPopup from '../popups/CreateChatPopup';
import RightSideMainChatPanel from '../components/RightSideMainChatPanel';
import { useAuth } from '../context/Context';


export default function Chat() {
    const [isUserTyping, setIsUserTyping] = useState(false);
    const [roomName, setRoomName] = useState("");
    const [showUserProfile, setShowUserProfile] = useState(false);
    const [showChatProfile, setShowChatProfile] = useState(false);
    const [showCreateChatPopup, setShowCreateChatPopup] = useState(false);
    const { socket, loggedInUser, chatInfo, setChatInfo } = useAuth();
    const { chatId } = useParams();
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    // Update mobile state on resize
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    // Handle chatId from URL for mobile navigation
    useEffect(() => {
        if (chatId) {
            setRoomName(chatId);
        } else {
            // Clear roomName and chatInfo when navigating back to home
            setRoomName("");
            if (isMobile) {
                setChatInfo(null);
            }
        }
    }, [chatId, isMobile, setChatInfo]);

    useEffect(() => {
        if (roomName !== "") {
            socket.emit("join_room", roomName);
        }
    }, [roomName, socket]);

    const handleInputChange = (inputText) => {
        if (inputText === "") {
            setIsUserTyping(false);
        } else {
            setIsUserTyping(true);
        }
    }

    useEffect(() => {
        const userName = loggedInUser.name;
        const userId = loggedInUser._id;
        socket.emit('send-active-flag', { userName, userId });

        socket.on('disconnect', () => {
            socket.emit('send-inactive-flag', { userName, userId });
        });
    }, [socket, loggedInUser])

    // Determine if chat panel should be visible on mobile based on URL
    const showChatPanel = isMobile ? (chatId !== undefined && chatId !== null) : true;
    const showLeftPanel = isMobile ? (!chatId) : true;

    return (
        <div className='w-screen h-screen bg-gray-950 text-white flex overflow-hidden md:px-6 md:p-4 p-0'>
            {/* Left Panel: Hidden on mobile when chat is selected */}
            {showLeftPanel && (
                <div className="flex flex-shrink-0 w-full md:w-[30%] h-full">
                    <LeftPanel
                        setRoomName={setRoomName}
                        setShowUserProfile={setShowUserProfile}
                        showUserProfile={showUserProfile}
                        setShowCreateChatPopup={setShowCreateChatPopup}
                        showCreateChatPopup={showCreateChatPopup}
                    />
                </div>
            )}

            {/* Right Panel: Hidden on mobile until a chat is selected */}
            {showChatPanel && (
                <div className="flex-grow h-full flex flex-col">
                    <RightSideMainChatPanel
                        setShowChatProfile={setShowChatProfile}
                        socket={socket}
                        isUserTyping={isUserTyping}
                        roomName={roomName}
                        setRoomName={setRoomName}
                        handleInputChange={handleInputChange}
                    />
                </div>
            )}

            {/* Popups (Modals) */}
            {showUserProfile && <UserProfilePopup closeProfilePopup={() => setShowUserProfile(false)} />}
            {showChatProfile && <ChatProfilePopup closeChatProfilePopup={() => setShowChatProfile(false)} />}
            {showCreateChatPopup && <CreateChatPopup closeCreateChatPopup={() => setShowCreateChatPopup(false)} roomName={roomName} setRoomName={setRoomName} />}
        </div>
    )
}


