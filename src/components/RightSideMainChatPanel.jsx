import React, { useState, useEffect, useRef } from 'react';
import { BiSend } from 'react-icons/bi';
import { BsEmojiSmile } from 'react-icons/bs';
import { AiFillFileAdd } from 'react-icons/ai';
import { useAuth } from '../context/Context';
import ScrollToBottom from 'react-scroll-to-bottom';
import ChatWindow from '../components/ChatWindow';
import TopUserBar from '../components/TopUserBar';
import EmptyChatPanel from '../components/EmptyChatPanel';
import { baseUrl } from '../utils/helper';
import axios from 'axios';
import Cookies from 'js-cookie';
import EmojiPicker from "emoji-picker-react";


function RightSideMainChatPanel({ setShowChatProfile, isUserTyping, roomName, handleInputChange }) {
    const [chatMessageList, setChatMessageList] = useState([]);
    const [message, setMessage] = useState("");
    const { socket, chatInfo, loggedInUser } = useAuth();
    const [showImoji, setShowImoji] = useState(false);
    const inputRef = useRef(null);
    const [previewFile, setPreviewFile] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const formData = new FormData();



    // Your logic for receiving messages would go in a useEffect, e.g.:
    // useEffect(() => {
    //   socket.on("receive_message", (data) => {
    //     setChatMessageList((list) => [...list, data.messageData]);
    //   });
    // }, [socket]);


    
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSelectedFile(file);
        setPreviewFile(URL.createObjectURL(file)); // preview image

        // Focus back on input
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);

        formData.append("file", file);

        console.log(formData)
        e.target.value = "";
    };

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


    const secondUser = (chatInfo) => {
        const otherUserId = chatInfo?.participants?.find(item => item !== loggedInUser._id)
        return otherUserId;
    }

    const retrieveChatMessageList = async (chatInfo) => {
        console.log(chatInfo)
        // otheruser id
        const { _id } = secondUser(chatInfo);
        console.log(_id)
        if (Object.keys(chatInfo).length > 0 && roomName !== "") {
            try {
                const response = await axios.get(`${baseUrl}/chats/get-messages-list/?chatId=${chatInfo._id}&otherUserId=${_id}`, {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("accessToken")}`
                    },
                    withCredentials: true
                })

                setChatMessageList(response.data.data);
            } catch (error) {
                console.log(error)
            }
        }
    }

    useEffect(() => {
        if (chatInfo !== null) {
            retrieveChatMessageList(chatInfo)
        }
    }, [chatInfo]);

    const addEmoji = (emoji) => {
        setMessage(message + emoji.emoji)

        // Focus back on input
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    }

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

                    {previewFile && (
                        <div className='relative p-2 w-fit bg-gray-800 rounded-lg flex ml-[6.5rem]'>
                            <img
                                src={previewFile}
                                alt="preview"
                                className='rounded-xl w-fit h-80 object-contain'
                            />

                            {/* Cancel preview */}
                            <button
                                onClick={() => {
                                    setPreviewFile(null);
                                    setSelectedFile(null);
                                }}
                                className='absolute top-1 right-1 bg-black text-white rounded-[50%] w-6 h-6 cursor-pointer border-none'
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    <div className="flex items-center bg-gray-800 p-2 border-t-2 border-gray-700">
                        <button
                            className='p-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors'
                            onClick={() => setShowImoji(!showImoji)}
                        >
                            <BsEmojiSmile className="text-xl" />
                            {/* <Picker/> */}
                            <div className="fixed bottom-[5.5rem] -ml-4">
                                <EmojiPicker
                                    open={showImoji}
                                    theme='dark'
                                    onEmojiClick={addEmoji}
                                />
                            </div>
                        </button>
                        <button className='p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors cursor-default'>
                            <input
                                className='hidden cursor-pointer'
                                id="file"
                                type="file"
                                name="file"
                                onChange={(e) => {
                                    handleFileUpload(e)
                                    handleInputChange(e)
                                }}
                            />
                            <label htmlFor="file" className='cursor-pointer'>
                                <AiFillFileAdd className="text-xl" />
                            </label>
                        </button>

                        <input
                            className='w-full p-3 bg-gray-700 text-white rounded-lg outline-none focus:ring-2 focus:ring-cyan-500 mx-2 transition-all'
                            ref={inputRef}
                            type="text"
                            placeholder='Type a message...'
                            value={message}
                            onClick={() => setShowImoji(false)}
                            onInput={(e) => { 
                                setMessage(e.target.value)
                                handleInputChange(e.target.value)
                            }}
                            onKeyDown={(event) => event.key === "Enter" && handleSendClick()}
                        // onInput={(e) => handleInputChange(e.target.value)} // Assuming this is for a 'typing...' indicator
                        />

                        <button
                            className='p-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-cyan-600 text-white hover:bg-cyan-500'
                            onClick={handleSendClick}
                            disabled={!message.trim() && !selectedFile}
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