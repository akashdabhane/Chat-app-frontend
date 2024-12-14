import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { baseUrl } from '../utils/helper';
import Cookies from 'js-cookie';
import { useAuth } from '../context/Context';

export default function TopUserBar({ setShowChatProfile }) {
    const [otherUser, setOtherUser] = useState({});
    const [isActive, setIsActive] = useState(null);
    const { socket, chatInfo, loggedInUser } = useAuth();

    useEffect(() => {
        const secondUser = (obj) => {
            return obj?.participants?.find(item => item._id !== loggedInUser._id);
        }
        
        if (!chatInfo?.isGroupChat) {
            let secondUserId;
            if (chatInfo?.participants) {
                const { _id } = secondUser(chatInfo);
                secondUserId = _id;
            } else {
                secondUserId = chatInfo?._id;
            }

            axios.get(`${baseUrl}/users/${secondUserId}`,
                {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${Cookies.get('accessToken')}`,
                    }
                })
                .then(response => {
                    setOtherUser(response.data.data);
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }, [chatInfo, loggedInUser]);

    useEffect(() => {
        socket.on("receive-active-flag", (data) => {
            setIsActive(true);
        });
    
        socket.on("receive-inactive-flag", (data) => {
            setIsActive(false);
        });
    }, [socket, isActive])


    return (
        <div>
            <div className="flex items-center justify-between p-2 pr-10 cursor-pointer bg-slate-700 lg:rounded-tr-2xl">
                <div className="space-x-2 flex items-center" onClick={() => setShowChatProfile(true)}>
                    <img className='rounded-[50%] w-10 h-10' src={chatInfo?.profileImage || otherUser?.profileImage} alt="profileImg" />
                    <div className='leading-5 h-9'>
                        <div className="flex items-start space-x-1 ">
                            {
                                chatInfo?.isGroupChat ?
                                    <span>{chatInfo?.name}</span>
                                    :
                                    <span>{otherUser?.name}</span>
                            }
                        </div>
                        {
                            (isActive && !chatInfo?.isGroupChat) && (
                                <div className='flex items-center space-x-1'>
                                    <span className={`${isActive ? "block w-2 h-2 bg-green-500 rounded-[50%]" : "hidden" } `}></span>
                                    <span className='text-gray-300 text-xs'>Active</span>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}



