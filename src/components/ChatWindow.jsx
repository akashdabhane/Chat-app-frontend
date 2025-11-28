import React, { useEffect, useState } from 'react';
import TypingIndicator from './TypingIndicator';
import { extractFirstName } from '../utils/helper';
import { useAuth } from '../context/Context';
import Skeleton from 'react-loading-skeleton';

export default function ChatWindow({ isUserTyping, roomName, chatMessageList, setChatMessageList }) {
  const [userData, setUserData] = useState([]);
  const [otherUserTyping, setOtherUserTyping] = useState(null);
  const { socket, chatInfo, loggedInUser, setNewMessageReceived } = useAuth();
  let previousDate = "";


  useEffect(() => {
    const userName = loggedInUser.name;
    const userId = loggedInUser._id;
    if (isUserTyping) {
      socket.emit("send-typing-flag", { roomName, userName, userId });
    } else if (!isUserTyping) {
      socket.emit("send-typing-stop-flag", { roomName, userName, userId });
    }
  }, [isUserTyping])

  useEffect(() => {
    socket.on("receive-typing-flag", (data) => {
      setOtherUserTyping(data);
    })

    socket.on("receive-typing-stop-flag", (data) => {
      setOtherUserTyping(null);
    })
  }, [socket, otherUserTyping])


  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChatMessageList([...chatMessageList, data.messageData]);
      setNewMessageReceived(true);
    });

    socket.on("receive_userdata", (data) => {
      setUserData([...userData, data]);
    });
  })




  return (
    <div className="p-4 md:py-1 md:p-6 space-y-1">
      {chatMessageList.map((item, index) => {
        const messageDate = new Date(item.createdAt || Date.now());

        // Format the date for the separator (e.g., "October 3, 2025")
        const currentDate = messageDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const showDate = currentDate !== previousDate;
        previousDate = currentDate;

        const isMyMessage = (item.author?._id || item.author) === loggedInUser._id;

        return (
          <React.Fragment key={item._id || index}>
            {/* Date Separator */}
            {showDate && (
              <div className="text-center my-3">
                <span className='bg-gray-800 text-gray-400 text-xs font-semibold px-3 py-1 rounded-full'>{currentDate}</span>
              </div>
            )}

            {/* Message Bubble */}
            <div className={`flex items-end gap-2 ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md lg:max-w-lg px-3 py-2 rounded-xl flex flex-col ${isMyMessage ? 'bg-cyan-600 text-white rounded-br-sm' : 'bg-gray-700 text-white rounded-bl-sm'}`}>

                {/* Sender's Name in a Group Chat */}
                {chatInfo.isGroupChat && !isMyMessage && (
                  <p className='text-xs text-cyan-300 font-bold mb-1'>
                    {extractFirstName(item.author?.name)}
                  </p>
                )}

                {/* Message Content */}
                <p className="text-sm break-words">{item.message}</p>

                {/* Timestamp */}
                <div className='text-xs text-gray-300 mt-1 self-end'>
                  {messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}

      {/* Typing Indicator */}
      {otherUserTyping && (
        <div className="flex items-end gap-2">
          <div className="bg-gray-700 rounded-xl rounded-bl-sm inline-block p-4">
            {chatInfo.isGroupChat && <p className='text-xs text-cyan-300 font-bold px-3 pt-2'>{extractFirstName(otherUserTyping?.userName)}</p>}
            <TypingIndicator />
          </div>
        </div>
      )}
    </div>
  )
}
