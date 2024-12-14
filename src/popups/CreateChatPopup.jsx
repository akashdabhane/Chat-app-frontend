import axios from 'axios';
import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import { baseUrl } from '../utils/helper';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Context';

function CreateChatPopUp({ closeCreateChatPopup, setRoomName, roomName }) {
    const [inputText, setInputText] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const navigate = useNavigate();
    const { setChatInfo } = useAuth();

    const handleSearchClick = () => {
        axios.get(`${baseUrl}/users/search?inputText=${inputText}`,
            {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${Cookies.get("accessToken")}`
                }
            })
            .then(response => {
                setSearchResult(response.data.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const handleUserClick = (otherUserId) => {
        axios.post(`${baseUrl}/chats/get-or-create-one-to-one-chat`, { "otherUserId": otherUserId },
            {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('accessToken')}`,
                },
                withCredentials: true,
            }).then((createdRoom) => {
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
        <div className='fixed inset-0 bg-slate-600 lg:rounded-br-2xl bacckdrop-blur-sm flex flex-col md:pt-4 md:px-4 md:pb-10 lg:mx-[31.3%] md:mx-[1%] md:mt-[5.5rem] md:mb-80 h-max md:h-max lg:h-[60%] md:w-[40%] lg:w-[50%]'
        // onBlurCapture={closeCreateChatPopup}
        >
            <div className="flex justify-between">
                <span>Create Chat</span>
                <IoClose className='text-2xl text-black cursor-pointer' onClick={closeCreateChatPopup} />
            </div>

            <main className='flex items-end justify-center my-2 '>
                <div className="">
                    <label htmlFor="search" className='text-gray-200 text-sm'>Search a user</label>
                    <input type="email" name="search" id="search" placeholder='Enter email of other person'
                        className='bg-transparent p-2 outline-none border rounded w-full'
                        value={inputText} onChange={(e) => setInputText(e.target.value)}
                    />
                </div>
                <button className='bg-purple-600 rounded p-2 px-3 text-black mx-3'
                    onClick={handleSearchClick}>
                    Search
                </button>
            </main>

            {
                searchResult.length > 0 &&
                (
                    <div className='flex flex-col justify-center mx-20 my-4 space-y-1'>
                        <h2 className=' text-gray-300'>Search Results</h2>
                        {
                            searchResult.map((user, index) => (
                                <div key={index} className='flex items-start px-2 py-1 border-b-2 border-slate-500 hover:bg-slate-500 cursor-pointer rounded'
                                    onClick={() => handleUserClick(user._id)}
                                >
                                    <img src={user.profileImage} alt={user.name} className='w-10 h-10 rounded-full' />
                                    <span className='ml-3'>{user.name}</span>
                                </div>
                            ))
                        }
                    </div>
                )
                // :
                // (
                //     <div className='flex justify-center mx-20 my-4'>
                //         <h2 className='text-gray-300'>No search results found</h2>
                //     </div>
                // )
            }
        </div>
    )
}

export default CreateChatPopUp