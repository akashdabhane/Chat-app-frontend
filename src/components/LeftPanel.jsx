import React, { useState, useRef, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { FiMoreVertical } from 'react-icons/fi';
import { BiSearchAlt2 } from "react-icons/bi";
import ContactListSkeleton from '../loadingSkeleton/ContactListSkeleton';
import axios from 'axios';
import { baseUrl } from '../utils/helper';
import ChatLabel from './ChatLabel';
import { IoIosAddCircleOutline } from "react-icons/io";
import { FiMessageSquare } from "react-icons/fi";
import { useAuth } from '../context/Context';


export default function LeftPanel({ setRoomName, showUserProfile, setShowUserProfile, showCreateChatPopup, setShowCreateChatPopup }) {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeChatId, setActiveChatId] = useState(null);
    const [highlightedChatId, setHighlightedChatId] = useState(null);
    const searchBox = useRef(null);
    const { setChatInfo, newMessageReceived, setNewMessageReceived, socket, setUpdateChatListFunction } = useAuth();

    useEffect(() => {
        axios.get(`${baseUrl}/chats/get-connected-chats`, {
            headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
            withCredentials: true
        })
            .then((data) => {
                const chats = data.data.data;
                setUsers(chats);
                
                // Join all chat rooms so we can receive messages even when chat is not open
                if (chats && chats.length > 0 && socket) {
                    chats.forEach((chat) => {
                        if (chat._id) {
                            socket.emit("join_room", chat._id);
                        }
                    });
                }
            })
            .catch(error => console.log(error))
            .finally(() => {
                setIsLoading(false);
                setNewMessageReceived(false);
            });
    }, [newMessageReceived, setNewMessageReceived, socket]);

    const handleSearchClick = async (inputText) => {
        // Your existing search logic
    };

    const handleChatClick = (item) => {
        setChatInfo(item);
        setRoomName(item._id);
        setActiveChatId(item._id);
    };

    // Function to move a chat to the top based on roomName and message data
    const moveChatToTop = useCallback((roomName, messageData) => {
        setUsers(prevUsers => {
            const chatIndex = prevUsers.findIndex(u => u._id === roomName);
            
            if (chatIndex === -1) {
                // Chat not found, trigger a full refetch
                setNewMessageReceived(true);
                return prevUsers;
            }

            // Only highlight if the chat is not already at the top
            if (chatIndex !== 0) {
                // Highlight the chat that's moving to top
                setHighlightedChatId(roomName);
                // Remove highlight after animation completes
                setTimeout(() => {
                    setHighlightedChatId(null);
                }, 600);
            }

            // Get the chat that received/sent the message
            const updatedChat = { ...prevUsers[chatIndex] };
            
            // Update lastMessageDetails with the new message
            const newMessage = {
                message: messageData.message,
                createdAt: messageData.createdAt || new Date().toISOString()
            };
            
            updatedChat.lastMessageDetails = [newMessage];
            
            // Remove the chat from its current position
            const remainingChats = prevUsers.filter(u => u._id !== roomName);
            
            // Put the updated chat at the top (most recent)
            return [updatedChat, ...remainingChats];
        });
    }, [setNewMessageReceived]);

    // Register the update function in context so other components can call it
    useEffect(() => {
        setUpdateChatListFunction(moveChatToTop);
        
        // Cleanup on unmount
        return () => {
            setUpdateChatListFunction(null);
        };
    }, [setUpdateChatListFunction, moveChatToTop]);

    useEffect(() => {
        const handleReceiveMessage = (data) => {
            moveChatToTop(data.roomName, data.messageData);
        };

        socket.on("receive_message", handleReceiveMessage);

        // Cleanup listener on unmount
        return () => {
            socket.off("receive_message", handleReceiveMessage);
        };
    }, [socket, moveChatToTop]);


    return (
        <>
            {isLoading ? (
                <ContactListSkeleton />
            ) : (
                <div className="chats w-full md:w-[40%] lg:w-[30%] bg-gray-800 lg:rounded-l-2xl text-white flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center p-3 justify-between border-b-2 border-gray-700 flex-shrink-0">
                        <div className="relative w-full mr-4">
                            <BiSearchAlt2 className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl' />
                            <input
                                className='w-full p-2 pl-10 text-md outline-none border-2 border-gray-700 bg-gray-900 rounded-lg focus:ring-2 focus:ring-cyan-500 transition-all'
                                type="text"
                                name="searchUser"
                                placeholder='Search or start new chat...'
                                ref={searchBox}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearchClick(searchBox.current.value)}
                            />
                        </div>
                        <div className='flex items-center space-x-2 text-gray-300'>
                            <button onClick={() => setShowCreateChatPopup(!showCreateChatPopup)} className="p-2 hover:bg-gray-700 rounded-full transition-colors relative group">
                                <IoIosAddCircleOutline className='text-2xl cursor-pointer' />
                                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    New Chat
                                </span>
                            </button>
                            <button onClick={() => setShowUserProfile(!showUserProfile)} className="p-2 hover:bg-gray-700 rounded-full transition-colors relative group">
                                <FiMoreVertical className='text-2xl cursor-pointer' />
                                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    More
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Chat List */}
                    <div className="overflow-y-auto flex-grow">
                        {users?.length > 0 ? (
                            users.map((item, index) => {
                                const hasLastMessageDetails = item?.lastMessageDetails?.length > 0;
                                const lastMessageDateObj = hasLastMessageDetails ? new Date(item.lastMessageDetails[0].createdAt) : null;
                                let lastMessageTime = "";
                                const isHighlighted = highlightedChatId === item._id;

                                if (lastMessageDateObj) {
                                    const now = new Date();
                                    const isToday = now.toDateString() === lastMessageDateObj.toDateString();
                                    // This logic for yesterday is buggy, fixing it.
                                    const yesterday = new Date();
                                    yesterday.setDate(yesterday.getDate() - 1);
                                    const isYesterday = yesterday.toDateString() === lastMessageDateObj.toDateString();

                                    if (isToday) {
                                        lastMessageTime = lastMessageDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                                    } else if (isYesterday) {
                                        lastMessageTime = 'Yesterday';
                                    } else {
                                        lastMessageTime = lastMessageDateObj.toLocaleDateString();
                                    }
                                }

                                return (
                                    <div
                                        key={item?._id}
                                        className={`p-3 border-b-2 border-gray-700 cursor-pointer transition-all duration-500 ease-in-out transform ${
                                            isHighlighted 
                                                ? 'bg-cyan-500/30 scale-[1.02] shadow-lg' 
                                                : activeChatId === item._id 
                                                    ? 'bg-cyan-500/20' 
                                                    : 'hover:bg-gray-700/50'
                                        }`}
                                        style={{
                                            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                        }}
                                        onClick={() => handleChatClick(item)}
                                    >
                                        <ChatLabel
                                            item={item}
                                            lastMessageText={hasLastMessageDetails ? item.lastMessageDetails[0].message : "No messages yet"}
                                            lastMessageTime={lastMessageTime}
                                        />
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4 text-center">
                                <FiMessageSquare className="w-16 h-16 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-300">No chats yet</h3>
                                <p>Click the '+' icon to start a new conversation.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
