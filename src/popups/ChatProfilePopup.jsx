// this component is responsible for showing information about the chat (other user information like userprofilePopup) or group information
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { baseUrl } from '../utils/helper';
import { IoClose } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";
import Cookies from 'js-cookie';

function ChatProfilePopup({ closeChatProfilePopup, otherUserId, chatInfo }) {
  const [isLoading, setIsLoading] = useState(true);
  const [otherUser, setOtherUser] = useState({});

  let secondUserId;
  useEffect(() => {
    if (!chatInfo.isGroupChat) {
      const secondUser = (obj) => {
        return obj.participants.find(item => item._id !== Cookies.get('userId'));
      }

      const { _id } = secondUser(chatInfo);
      secondUserId = _id;

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
        .finally(() => {
          setIsLoading(false);
        })
    }
  }, [])

  const handleExitGroupClick = () => {
    axios.patch(`${baseUrl}/groups/remove-participant`,
      {
        chatId: chatInfo._id,
        userId: Cookies.get('userId'),
      },
      {
        headers: {
          'Authorization': `Bearer ${Cookies.get('accessToken')}`,
        },
        withCredentials: true,
      })
      .then(response => {
        console.log(response.data.message);
        closeChatProfilePopup();
      })
      .catch(error => {
        console.log(error)
      })
  }

  const handleBlockUserClick = () => {
    axios.patch(`${baseUrl}/chats/block-user/${secondUserId}`,
      {
        chatId: chatInfo._id,
      },
      {
        headers: {
          'Authorization': `Bearer ${Cookies.get('accessToken')}`,
        },
        withCredentials: true,
      })
      .then(response => {
        console.log(response.data.message);
        closeChatProfilePopup();
      })
      .catch(error => {
        console.log(error)
      })
  }

  return (
    <div className='fixed inset-0 bg-slate-600 lg:rounded-br-2xl bacckdrop-blur-sm flex flex-col justify-between md:pt-4 md:px-4 md:pb-10 lg:mx-[31.3%] md:mx-[1%] md:mt-[5.5rem] md:mb-80 h-max md:h-max md:w-[40%] lg:w-[25%]'
      onBlurCapture={closeChatProfilePopup}>
      <div className="flex justify-end">
        <IoClose className='text-2xl text-black cursor-pointer' onClick={closeChatProfilePopup} />
      </div>
      <div className="p-4">
        <main className='py-4 border-b-[1px] border-gray-800 space-y-4'>
          <div className="flex justify-center">
            <img className={`block rounded-full cursor-pointer text-center`}
              src={otherUser?.profileImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVTtlOwG_6l93Lo3NcGZcQpGx4LXNwa3lF5A&s"}
              alt="profile photo" width={100} height={100}
            // onMouseEnter={() => setHoverCSS("")}
            // onMouseLeave={() => setHoverCSS("")}
            />

          </div>
          {
            chatInfo.isGroupChat &&
            <>
              <div className="flex justify-between items-center">
                <p>Created on</p>
                <p>{new Date(chatInfo?.createdAt).toUTCString().slice(0, 16)}</p>
              </div>
              <div>
                <span className='block text-gray-300'>Description</span>
                <p>{chatInfo?.description}</p>
              </div>
            </>
          }
          {
            !chatInfo.isGroupChat &&
            <>
              <div className="flex justify-between items-center">
                <input className='bg-transparent outline-slate-800'
                  type="text" value={otherUser?.name} contentEditable="false" />
              </div>
              <p>
                <span className='block text-gray-300'>email</span>
                <span>{otherUser?.email}</span>
              </p>
            </>
          }
        </main>

        {
          chatInfo.isGroupChat ?
            <button className="bg-red-500 text-black rounded px-2 p-1 my-6 text-lg font-semibold w-24"
              onClick={handleExitGroupClick}>
              Exit
            </button>
            :
            <button className="bg-red-500 text-black rounded px-2 p-1 my-6 text-lg font-semibold w-24"
              onClick={handleBlockUserClick}>
              Block
            </button>
        }
      </div>

    </div>
  )
}

export default ChatProfilePopup
