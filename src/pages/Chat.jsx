import React, { useEffect, useState } from 'react'
import LeftPanel from '../components/LeftPanel';
import '../styles/index.css'
import UserProfilePopup from '../popups/UserProfilePopup';
import ChatProfilePopup from '../popups/ChatProfilePopup';
import RightSideMainChatPanel from '../components/RightSideMainChatPanel';
import { useAuth } from '../context/Context';
// import { Picker } from 'emoji-mart';
// import 'emoji-mart/css/emoji-mart.css';


export default function Chat() {
    const [isUserTyping, setIsUserTyping] = useState(false);
    const [chatInfo, setChatInfo] = useState({});
    const [roomName, setRoomName] = useState("");
    const [showUserProfile, setShowUserProfile] = useState(false);
    const [showChatProfile, setShowChatProfile] = useState(false);
    const { socket } = useAuth();

    useEffect(() => {
        if (roomName !== "") {
            socket.emit("join_room", roomName);
        }
    }, [roomName, socket]);


    const handleChatOnClick = (obj) => {
        setChatInfo(obj);
    }

    useEffect(() => {
        setRoomName(chatInfo._id)
    }, [chatInfo])

    const handleInputChange = async (inputText) => {
        if (inputText === "") {
            setIsUserTyping(false);
        } else {
            setIsUserTyping(true);
        }
    }


    return (
        <>
            <div className='lg:mx-[10%] md:mx-[1%] md:pt-8 md:pb-8 flex h-[93vh] md:h-[97vh] text-white'>
                {
                    <LeftPanel setChatInfo={setChatInfo} handleChatOnClick={handleChatOnClick}
                        chatInfo={chatInfo} setShowUserProfile={setShowUserProfile}
                    />
                }
                <RightSideMainChatPanel chatInfo={chatInfo} setChatInfo={setChatInfo}
                    setShowChatProfile={setShowChatProfile} socket={socket} isUserTyping={isUserTyping}
                    roomName={roomName} setRoomName={setRoomName} handleInputChange={handleInputChange}
                />
                {
                    showUserProfile && <UserProfilePopup closeProfilePopup={() => setShowUserProfile(false)} />
                }
                {
                    showChatProfile && <ChatProfilePopup closeChatProfilePopup={() => setShowChatProfile(false)} chatInfo={chatInfo} setChatInfo={setChatInfo} />
                }
            </div >
        </>
    )
}


