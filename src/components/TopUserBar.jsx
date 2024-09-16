import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FcVideoCall } from 'react-icons/fc';
import { baseUrl } from '../utils/helper';
import Cookies from 'js-cookie';

export default function TopUserBar({ userData, chatInfo, setChatInfo }) {
    const [otherUser, setOtherUser] = useState({});
    console.log(chatInfo)


    useEffect(() => {
        const secondUser = (obj) => {
            return obj.participants.find(item => item._id !== Cookies.get('userId'));
        }

        const { _id } = secondUser(chatInfo);
        const secondUserId = _id;

        axios.get(`${baseUrl}/users/${secondUserId}`, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${Cookies.get('accessToken')}`,
            }
        })
            .then(response => {
                console.log(response.data.data)
                setOtherUser(response.data.data);
            })
            .catch(error => {
                console.log(error)
            })
    }, [])

    return (
        <div>
            <div className="flex items-center justify-between p-2 pr-10 cursor-pointer bg-slate-700 lg:rounded-tr-2xl">
                <div className="space-x-2 flex items-center">
                    <img className='rounded-[50%] w-10 h-10' src="https://images.pexels.com/photos/10057618/pexels-photo-10057618.jpeg?auto=compress&cs=tinysrgb&w=600" alt="profileImg" />
                    <div className='leading-5'>
                        <div className="flex items-center space-x-1">
                            <span className={`${userData.isActive ? 'hidden' : "block w-2 h-2 bg-green-500 rounded-[50%]"} `}></span>
                            {
                                chatInfo?.isGroupChat ?
                                    <span>{chatInfo && chatInfo.name}</span>
                                    :
                                    <span>{otherUser && otherUser.name}</span>
                            }
                        </div>
                        <div className='flex  items-center'>
                            {
                                userData.isTyping && (
                                    <span className='text-green-500'>typing..</span>
                                )
                            }
                        </div>
                    </div>
                </div>
                <span className='text-2xl text-white'>
                    <FcVideoCall className='cursor-pointer ' />
                </span>
            </div>
        </div>
    )
}



