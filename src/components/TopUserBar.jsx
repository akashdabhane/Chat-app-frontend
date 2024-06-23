import React from 'react'
import { FcVideoCall } from 'react-icons/fc';

export default function TopUserBar({ userData, otherUser }) {
    return (
        <div>
            <div className="flex items-center justify-between p-2 pr-10 cursor-pointer bg-slate-700 lg:rounded-tr-2xl">
                <div className="space-x-2 flex items-center">
                    <img className='rounded-[50%] w-10 h-10' src="https://images.pexels.com/photos/10057618/pexels-photo-10057618.jpeg?auto=compress&cs=tinysrgb&w=600" alt="profileImg" />
                    <div className='leading-5'>
                        <div className="flex items-center space-x-1">
                            <span className={`${userData.isActive ? 'hidden' : "block w-2 h-2 bg-green-500 rounded-[50%]"} `}></span>
                            <span>{otherUser ? otherUser.name : "General Chat"}</span>
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



