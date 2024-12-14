import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/Context';

function ChatLabel({ item, lastMessageText, lastMessageTime }) {
    const [userProfileImagePath, setUserProfileImagePath] = useState("");
    const { loggedInUser } = useAuth();

    useEffect(() => {
        if (!item.isGroupChat) {
            if (item?.participants[1]?._id === loggedInUser._id) {
                setUserProfileImagePath(item?.participants[0]?.profileImage)
            } else {
                setUserProfileImagePath(item?.participants[1]?.profileImage)
            }
        } else {
            setUserProfileImagePath(item?.profileImage)
        }
    }, [])


    return (
        <>
            {
                item?.isGroupChat ?
                    (
                        <>
                            <div className="space-x-2 flex w-60">
                                <img className='rounded-[50%] w-10 h-10' src={item?.profileImage} alt="profileImg" />
                                <div className="leading-5">
                                    <p>{item?.name}</p>

                                    <span className='text-gray-300 text-sm line-clamp-1'>
                                        {lastMessageText}
                                    </span>
                                </div>
                            </div>

                            <div className='text-xs'>
                                {lastMessageTime}
                            </div>
                        </>
                    )
                    :
                    (
                        <>
                            <div className="space-x-2 flex w-60">
                                <img className='rounded-[50%] w-10 h-10'
                                    src={userProfileImagePath}
                                    alt="profileImg"
                                />
                                <div className="leading-5">
                                    {
                                        item?.participants
                                            ?
                                            <p>
                                                {
                                                    item?.participants[1]?._id === loggedInUser._id
                                                        ?
                                                        item?.participants[0]?.name
                                                        :
                                                        item?.participants[1]?.name
                                                }
                                            </p>
                                            :
                                            <p>{item?.name}</p>
                                    }

                                    <span className='text-gray-300 text-sm line-clamp-1'>
                                        {lastMessageText}
                                    </span>
                                </div>
                            </div>

                            <div className='text-xs'>
                                {lastMessageTime}
                            </div>
                        </>
                    )
            }
        </>
    )
}

export default ChatLabel