import axios from 'axios';
import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import { baseUrl } from '../utils/helper';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Context';
import { BiSearchAlt2 } from "react-icons/bi";

const UserSearchResult = ({ user, onUserClick }) => (
    <div
        className='flex items-center p-3 hover:bg-gray-700/50 cursor-pointer rounded-lg transition-colors duration-200'
        onClick={() => onUserClick(user._id)}
    >
        <img
            src={user.profileImage || `https://placehold.co/40x40/1F2937/FFFFFF?text=${user.name.charAt(0)}`}
            alt={user.name}
            className='w-10 h-10 rounded-full object-cover border-2 border-gray-600'
        />
        <span className='ml-4 text-sm font-medium text-gray-200'>{user.name}</span>
    </div>
);

function CreateChatPopUp({ closeCreateChatPopup, setRoomName, roomName }) {
    const [inputText, setInputText] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const navigate = useNavigate();
    const { setChatInfo } = useAuth();

    const handleSearch = () => {
        setIsSearching(true)
        axios.get(`${baseUrl}/users/search?inputText=${inputText}`,
            {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${Cookies.get("accessToken")}`
                }
            })
            .then(response => {
                console.log(response.data.data)
                setSearchResult(response.data.data);
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                setHasSearched(true);
                setIsSearching(false);
            })
    }

    const handleUserClick = (otherUserId) => {
        axios.post(`${baseUrl}/chats/get-or-create-one-to-one-chat`, { "otherUserId": otherUserId },
            {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('accessToken')}`,
                },
                withCredentials: true,
            }).then((createdRoom) => {
                // console.log(createdRoom.data.data)
                setChatInfo(createdRoom.data.data);
                setRoomName(createdRoom.data.data._id);
                navigate(`/`);
            })
            .catch((error) => {
                console.log(error);
            })

        closeCreateChatPopup();
    }

    return (
        <div className='fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4'>
            {/* Popup Panel */}
            <div className='bg-gray-800 text-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col'>
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className='text-lg font-semibold text-gray-200'>New Conversation</h2>
                    <button
                        onClick={closeCreateChatPopup}
                        className='p-1.5 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors'
                        aria-label="Close"
                    >
                        <IoClose className='text-xl' />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="p-4">
                    <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                        <div className="relative">
                            {/* <BiSearchAlt2 className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none cursor-pointer hover:bg-red-600'
                                onClick={(e) => { e.preventDefault(); handleSearch(); }} /> */}
                            <input
                                type="text"
                                placeholder='Search by name or email...'
                                className='w-full p-2.5 pl-11 text-sm outline-none border-2 border-gray-700 bg-gray-900 rounded-lg focus:ring-2 focus:ring-cyan-500 transition-all'
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                autoFocus
                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSearch(); } }}
                            />
                        </div>
                    </form>
                </div>

                {/* Search Results Area */}
                <div className='overflow-y-auto flex-grow px-4 pb-4 min-h-[250px]'>
                    {isSearching ? (
                        <div className="flex justify-center items-center pt-10 bg-gray-800">
                            Loading...
                        </div>
                    ) : (hasSearched && searchResult?.length > 0 && searchResult[0] !== null) ? (
                        <div className="space-y-1">
                            {searchResult?.map((user) => (
                                <UserSearchResult key={user._id} user={user} onUserClick={handleUserClick} />
                            ))}
                        </div>
                    ) : hasSearched ? (
                        <div className="text-center text-gray-500 pt-16">
                            <p className="font-semibold">No users found</p>
                            <p className="text-sm">Please check the spelling or try another search.</p>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 pt-16">
                            <p>Find friends and colleagues to begin chatting.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CreateChatPopUp;