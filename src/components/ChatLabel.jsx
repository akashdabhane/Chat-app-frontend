import React, { useMemo } from 'react';
import { useAuth } from '../context/Context';

function ChatLabel({ item, lastMessageText, lastMessageTime }) {
    const { loggedInUser } = useAuth();

    const chatPartner = useMemo(() => {
        if (item.isGroupChat || !item.participants) return null;
        return item.participants.find(p => p._id !== loggedInUser._id);
    }, [item, loggedInUser]);

    const displayName = item.isGroupChat ? item.name : chatPartner?.name || "Unknown User";
    const profileImage = item.isGroupChat ? item.profileImage : chatPartner?.profileImage;

    return (
        <div className="flex justify-between items-center w-full">
            <div className="flex items-center space-x-4 min-w-0">
                <div className="relative flex-shrink-0">
                    <img 
                        className='rounded-full w-12 h-12 object-cover bg-gray-700' 
                        src={profileImage || 'https://res.cloudinary.com/domlldpib/image/upload/v1727176756/chat-app-m/ggaqjqfhcnmz6nhnexrm.png'} 
                        alt="profile" 
                        onError={(e) => { e.target.onerror = null; e.target.src='https://res.cloudinary.com/domlldpib/image/upload/v1727176756/chat-app-m/ggaqjqfhcnmz6nhnexrm.png' }}
                    />
                </div>
                <div className="flex-grow min-w-0">
                    <p className="font-bold truncate text-white">{displayName}</p>
                    <p className='text-gray-400 text-sm truncate'>
                        {lastMessageText}
                    </p>
                </div>
            </div>

            <div className='text-xs text-gray-500 flex flex-col items-end space-y-1 flex-shrink-0 ml-2'>
                <span className="whitespace-nowrap">{lastMessageTime}</span>
                {item.unreadMessages > 0 && (
                    <span className="bg-cyan-500 text-gray-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {item.unreadMessages}
                    </span>
                )}
            </div>
        </div>
    );
}

export default ChatLabel;