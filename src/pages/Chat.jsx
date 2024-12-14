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
    const { socket } = useAuth();


    useEffect(() => {
        if (roomName !== "") {
            socket.emit("join_room", roomName);
        }
        console.log(roomName);
    }, [roomName, socket]);


    const handleInputChange = (inputText) => {
        if (inputText === "") {
            setIsUserTyping(false);
        } else {
            setIsUserTyping(true);
        }
    }


    return (
        <>
            <div className='lg:mx-[10%] md:mx-[1%] md:pt-8 md:pb-8 flex h-[93vh] md:h-[97vh] text-white'>
                <LeftPanel
                    setShowUserProfile={setShowUserProfile} showUserProfile={showUserProfile}
                    showCreateChatPopup={showCreateChatPopup} setShowCreateChatPopup={setShowCreateChatPopup}
                    setRoomName={setRoomName}
                />
                <RightSideMainChatPanel
                    setShowChatProfile={setShowChatProfile} socket={socket} isUserTyping={isUserTyping}
                    roomName={roomName} setRoomName={setRoomName} handleInputChange={handleInputChange}
                />
                {
                    showUserProfile && (
                        <UserProfilePopup closeProfilePopup={() => setShowUserProfile(false)} />
                    )
                }
                {
                    showChatProfile && (
                        <ChatProfilePopup closeChatProfilePopup={() => setShowChatProfile(false)} />
                    )
                }
                {
                    showCreateChatPopup && (
                        <CreateChatPopup closeCreateChatPopup={() => setShowCreateChatPopup(false)}
                            roomName={roomName} setRoomName={setRoomName}
                        />
                    )
                }
            </div>
        </>
    )
}


