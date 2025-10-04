import React, { useState } from 'react';
import { BiSend } from 'react-icons/bi';
import { BsEmojiSmile } from 'react-icons/bs';
import { AiFillFileAdd } from 'react-icons/ai';
import { useAuth } from '../context/Context';
import ScrollToBottom from 'react-scroll-to-bottom';
import ChatWindow from '../components/ChatWindow';
import TopUserBar from '../components/TopUserBar';
import EmptyChatPanel from '../components/EmptyChatPanel';


function RightSideMainChatPanel({ setShowChatProfile, isUserTyping, roomName, handleInputChange }) {
    const [chatMessageList, setChatMessageList] = useState([]);
    const [message, setMessage] = useState("");
    const { socket, chatInfo, loggedInUser } = useAuth();

    // Your logic for receiving messages would go in a useEffect, e.g.:
    // useEffect(() => {
    //   socket.on("receive_message", (data) => {
    //     setChatMessageList((list) => [...list, data.messageData]);
    //   });
    // }, [socket]);

    const handleSendClick = () => {
        if (message.trim() !== "") {
            const messageData = {
                author: loggedInUser._id,
                message: message,
                room: roomName,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
            };
            setChatMessageList([...chatMessageList, messageData]);
            socket.emit("send_message", { roomName, messageData });
            setMessage("");
        }
    };

    return (
        <div className="bg-gray-900 w-full flex flex-col justify-between lg:rounded-r-2xl border-l-2 border-gray-700 h-full">
            {chatInfo === null ? (
                <EmptyChatPanel />
            ) : (
                <>
                    <TopUserBar setShowChatProfile={setShowChatProfile} />
                    
                    <ScrollToBottom className="flex-grow w-full overflow-y-auto overflow-x-hidden">
                        <ChatWindow 
                            chatMessageList={chatMessageList} 
                            setChatMessageList={setChatMessageList}
                            isUserTyping={isUserTyping} 
                            roomName={roomName}
                        />
                    </ScrollToBottom>
                    
                    <div className="flex items-center bg-gray-800 p-2 border-t-2 border-gray-700">
                        <button className='p-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors'>
                            <BsEmojiSmile className="text-xl"/>
                        </button>
                        <button className='p-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors'>
                            <AiFillFileAdd className="text-xl"/>
                        </button>

                        <input 
                            className='w-full p-3 bg-gray-700 text-white rounded-lg outline-none focus:ring-2 focus:ring-cyan-500 mx-2 transition-all' 
                            type="text" 
                            placeholder='Type a message...'
                            value={message} 
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(event) => event.key === "Enter" && handleSendClick()}
                            // onInput={(e) => handleInputChange(e.target.value)} // Assuming this is for a 'typing...' indicator
                        />
                        
                        <button 
                            className='p-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-cyan-600 text-white hover:bg-cyan-500' 
                            onClick={handleSendClick}
                            disabled={!message.trim()}
                        >
                            <BiSend className='text-xl' />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default RightSideMainChatPanel