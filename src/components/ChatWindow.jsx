import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import TypingIndicator from './TypingIndicator';
import axios from 'axios';
import { baseUrl, extractFirstName } from '../utils/helper';
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
  }, [socket])


  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChatMessageList([...chatMessageList, data.messageData]);
      setNewMessageReceived(true);
    });

    socket.on("receive_userdata", (data) => {
      setUserData([...userData, data]);
    });
  })

  useEffect(() => {
    const secondUser = (chatInfo) => {
      return chatInfo?.participants?.find(item => item._id !== loggedInUser._id);
    }

    // otheruser id
    const { _id } = secondUser(chatInfo);
    if (Object.keys(chatInfo).length > 0 && roomName !== "") {
      axios.get(`${baseUrl}/chats/get-messages-list/?chatId=${chatInfo._id}&otherUserId=${_id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`
        },
        withCredentials: true
      })
        .then((response) => {
          setChatMessageList(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        })
    }
  }, [chatInfo]);


  return (
    <div className="showMessages py-4 px-2 h-[70vh] flex flex-col">
      {
        chatMessageList.length > 0 && (
          chatMessageList.map((item, index) => {
            const currentDate = new Date(item.createdAt || Date.now()).toUTCString().slice(0, 16); // Extract the date part
            const showDate = currentDate !== previousDate; // Compare with the previous date

            // Update previousDate to the current date for the next iteration
            previousDate = currentDate;

            return (
              <React.Fragment key={index}>
                {
                  showDate &&
                  <div className="text-center my-1">
                    <span className='bg-slate-700 px-2 p-1 rounded '>
                      {currentDate}
                    </span>
                  </div>
                }
                <div className={`w-fit text-black p-2 py-1 mx-4 my-1 rounded-lg ${(loggedInUser._id === item.author._id || loggedInUser._id === item.author) ?
                  " rounded-tr-[0%] float-right bg-blue-300 self-end" :
                  "rounded-tl-[0%] float-left bg-green-300 self-start"}`}>
                  <div className='max-w-xl'>
                    {
                      chatInfo.isGroupChat && (
                        <span className='text-sm text-pink-500'>
                          {
                            (loggedInUser._id === item.author._id || loggedInUser._id === item.author)
                              ? "You"
                              : extractFirstName(item.author.name) || extractFirstName(item.author)
                          }:
                        </span>
                      )
                    }
                    {item.message || <Skeleton />}
                  </div>
                  <div className='text-[.60rem] leading-3 float-right flex items-center space-x-1'>
                    <span>
                      {
                        item.time || (new Date(item.createdAt).getHours()
                          + ":" +
                          new Date(item.createdAt).getMinutes())
                      }
                    </span>
                    {/* <div className={`${(item.status === "sent" && loggedInUser._id === item.author._id) ? "w-[0.40rem] h-[0.40rem] rounded-full border-2 bg-gray-400" : "hidden"}`}></div>
                    <div className={`${(item.status === "delievered" && loggedInUser._id === item.author._id) ? "w-[0.40rem] h-[0.40rem] rounded-full bg-blue-500" : "hidden"}`}></div>
                    <div className={`${(item.status === "read" && loggedInUser._id === item.author._id) ? "w-[0.40rem] h-[0.40rem] rounded-full bg-pink-500" : "hidden"}`}></div> */}
                  </div>
                </div>
              </React.Fragment>
            )
          })
        )
      }
      {
        otherUserTyping !== null &&
        (
          <div className={`w-fit text-black p-2 py-1 mx-4 my-1 rounded-lg rounded-tl-[0%] float-left bg-green-300 self-start`}>
            <div className='flex items-center space-x-2 py-2'>
              {
                chatInfo.isGroupChat && (
                  <span className='text-sm text-pink-500'>{extractFirstName(otherUserTyping?.userName)}: </span>
                )
              }
              <TypingIndicator />
            </div>
          </div>
        )
      }
    </div>
  )
}
