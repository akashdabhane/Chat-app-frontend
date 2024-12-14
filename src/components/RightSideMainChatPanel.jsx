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

    const handleSendClick = () => {
        console.log(message);
        if (message !== "") {
            const messageData = {
                author: loggedInUser._id,
                message: message,
                room: roomName,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            }

            setChatMessageList([...chatMessageList, messageData]);

            socket.emit("send_message", { roomName, messageData });

            setMessage("");
        }
    }

    return (
        <div className="room bg-slate-500 w-full flex flex-col justify-between lg:rounded-r-2xl">
            {
                chatInfo === null
                    ?
                    <EmptyChatPanel />
                    :
                    (
                        <>
                            <TopUserBar setShowChatProfile={setShowChatProfile} />
                            <ScrollToBottom className="showMessages h-[90%] w-[100%] overflow-x-hidden flex flex-col pb-2">
                                <ChatWindow chatMessageList={chatMessageList} setChatMessageList={setChatMessageList}
                                    isUserTyping={isUserTyping} roomName={roomName}
                                />
                            </ScrollToBottom>
                            <div className="inputs flex items-center border-t-2 bg-slate-700 border-gray-800 space-x-1 p-1 pr-4 lg:rounded-br-2xl">
                                <label className='px-4 p-2 cursor-pointer hover:bg-slate-900 rounded-md' htmlFor="emoji"><BsEmojiSmile /></label>
                                <input className='hidden' type="file" name="emoji" id="emoji" />
                                <label className='px-4 p-2 cursor-pointer hover:bg-slate-900 rounded-md' htmlFor="file"><AiFillFileAdd /></label>
                                <input className='hidden' type="file" name="file" id="file" />
                                <input className='w-full p-2 py-1 text-lg rounded text-black outline-none border-none' type="text" placeholder='type here...'
                                    value={message} onKeyDown={(event) => event.key === "Enter" && handleSendClick()} onChange={(e) => setMessage(e.target.value)}
                                    onInput={(e) => handleInputChange(e.target.value)}
                                />
                                <BiSend className='text-4xl bg-green-500 p-1 rounded cursor-pointer' onClick={handleSendClick} />
                            </div>
                        </>
                    )
            }
        </div>
    )
}

export default RightSideMainChatPanel