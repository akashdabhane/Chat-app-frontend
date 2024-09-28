import React from 'react';
import { IoChatbox } from "react-icons/io5";
import { CiLock } from "react-icons/ci";

function EmptyChatPanel() {
    return (
        <div className="text-slate-700 flex flex-col items-center justify-center h-full">
            <IoChatbox className='text-4xl' />
            <p>Send and receive messages using chatapp</p>
            <p className='flex items-center space-x-2'>
                <CiLock className='font-bold' />
                <span>End-to-end encryption</span>
            </p>
        </div>
    )
}

export default EmptyChatPanel