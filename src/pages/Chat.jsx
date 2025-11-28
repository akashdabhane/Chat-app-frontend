import React, { useEffect, useState } from 'react';
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
    const { socket, loggedInUser } = useAuth();

    // This state is added to manage the view on mobile devices
    const [selectedChat, setSelectedChat] = useState(null);

    useEffect(() => {
        if (roomName !== "") {
            socket.emit("join_room", roomName);
        }
        console.log(roomName);
    }, [roomName, socket]);


    const handleInputChange = (inputText) => {
        // 1st for text input and 2nd for file input
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
    }, [])

    // useEffect(() => {
    //     const userId = loggedInUser._id;

    //     // when user comes online
    //     socket.emit("user-online", userId);
    // }, [])


    return (
        <div className='w-screen h-screen bg-gray-950 text-white flex overflow-hidden px-6 p-4'>
            {/* Left Panel: Visible on desktop, conditionally visible on mobile */}
            {/* <div className={`flex-shrink-0 w-full h-full ${selectedChat ? 'hidden' : 'flex'} md:flex flex-col`}> */}
            {/* md:w-[350px] lg:w-[380px] xl:w-[420px] */}
            <LeftPanel
                setRoomName={setRoomName}
                setShowUserProfile={setShowUserProfile}
                showUserProfile={showUserProfile}
                setShowCreateChatPopup={setShowCreateChatPopup}
                showCreateChatPopup={showCreateChatPopup}
                setSelectedChat={setSelectedChat} // Pass handler to update view
            />
            {/* </div> */}

            {/* Right Panel: Hidden on mobile until a chat is selected */}
            <div className={`flex-grow h-full ${selectedChat ? 'flex' : 'hidden'} md:flex flex-col`}>
                <RightSideMainChatPanel
                    setShowChatProfile={setShowChatProfile}
                    socket={socket}
                    isUserTyping={isUserTyping}
                    roomName={roomName}
                    setRoomName={setRoomName}
                    handleInputChange={handleInputChange}
                    onBack={() => setSelectedChat(null)} // Handler to go back on mobile
                />
            </div>

            {/* Popups (Modals) */}
            {showUserProfile && <UserProfilePopup closeProfilePopup={() => setShowUserProfile(false)} />}
            {showChatProfile && <ChatProfilePopup closeChatProfilePopup={() => setShowChatProfile(false)} />}
            {showCreateChatPopup && <CreateChatPopup closeCreateChatPopup={() => setShowCreateChatPopup(false)} roomName={roomName} setRoomName={setRoomName} />}
        </div>
    )
}


