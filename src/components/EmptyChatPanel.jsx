import React from 'react';
import { IoChatbox } from "react-icons/io5";
import { CiLock } from "react-icons/ci";

function EmptyChatPanel() {
    return (
        <div className="bg-gray-900 text-gray-400 flex flex-col items-center justify-center h-full w-full p-8 text-center border-l-2 border-gray-700 rounded-r-2xl">
            <div className="max-w-md">
                <IoChatbox className='text-8xl text-gray-700 mx-auto mb-6' />
                <h2 className="text-2xl font-bold text-white mb-2">Welcome to Your ChatApp</h2>
                <p className="mb-8">
                    Select a conversation from the left panel to start messaging. Your messages are secure and private.
                </p>
                <div className='flex items-center justify-center space-x-2 text-sm text-gray-500'>
                    <CiLock className='w-4 h-4' />
                    <span>End-to-end encrypted</span>
                </div>
            </div>
        </div>
    );
}

export default EmptyChatPanel;