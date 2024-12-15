import React, { useState, useRef, useEffect } from 'react';
import Cookies from 'js-cookie';
import { FiMoreVertical } from 'react-icons/fi';
import { BiSearchAlt2 } from "react-icons/bi";
import ContactListSkeleton from '../loadingSkeleton/ContactListSkeleton';
import axios from 'axios';
import { baseUrl } from '../utils/helper';
import ChatLabel from './ChatLabel';
import { IoIosAddCircleOutline } from "react-icons/io";
import { useAuth } from '../context/Context';


export default function LeftPanel({ setRoomName, showUserProfile, setShowUserProfile, showCreateChatPopup, setShowCreateChatPopup }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchBox = useRef(null);
  const { setChatInfo, newMessageReceived, setNewMessageReceived } = useAuth();

  // use effects 
  useEffect(() => {
    axios.get(`${baseUrl}/chats/get-connected-chats`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`
        },
        withCredentials: true
      })
      .then((data) => {
        setUsers(data.data.data);
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        setIsLoading(false);
        setNewMessageReceived(false);
      })
  }, [newMessageReceived]);


  // search for users ------------ // search for users by email, their name, group name in their contact (created chat)
  const handleSearchClick = async (inputText) => {
    //   try {
    //     // users could be zero(not found anything), one or more if inputText is email then we one user 
    //     // and if inputText is simple text then app will search by username and then return list of users
    //     const users = await axios.get(`${baseUrl}/users/search?inputText=${inputText}`, {
    //       headers: {
    //         Authorization: `Bearer ${Cookies.get("accessToken")}`
    //       },
    //       withCredentials: true
    //     })

    //     console.log(users.data.data)
    //     setUsers(users.data.data)
    //   } catch (error) {
    //     console.log(error)
    //   }
  }


  return (
    <>
      {
        isLoading ?
          <ContactListSkeleton />
          :
          <div className="chats md:w-[40%] lg:w-[36%] md:block bg-slate-700 lg:rounded-l-2xl">
            <div className="flex items-center p-3 justify-between border-b-2 border-slate-500">
              <div className="flex items-center justify-between bg-slate-600 rounded px-2 ">
                <input className='w-full p-1 text-md outline-none border-none bg-transparent'
                  type="text" name="searchUser" id="searchUser" placeholder='search here...' ref={searchBox}
                />

                <BiSearchAlt2 className='cursor-pointer text-lg' onClick={() => {
                  searchBox.current.value === "" ?
                    searchBox.current.focus()
                    :
                    handleSearchClick(searchBox.current.value);
                }} />
              </div>

              <span className='text-xl flex items-center px-2 space-x-2 '>
                <IoIosAddCircleOutline className=' cursor-pointer' onClick={() => setShowCreateChatPopup(!showCreateChatPopup)} />
                <FiMoreVertical className=' cursor-pointer' onClick={() => setShowUserProfile(!showUserProfile)} />
              </span>
            </div>
            {
              (users?.length > 0) ?
                (
                  users.map((item, index) => {
                    // calculations -------------------------------------------
                    // // Check if lastMessageDetails exists and has elements
                    const hasLastMessageDetails = item?.lastMessageDetails?.length > 0;
                    const currentDate = new Date(Date.now()).toUTCString().slice(5, 16);

                    // Default to an empty string if no lastMessageDetails
                    const lastMessageDate = hasLastMessageDetails ? new Date(item?.lastMessageDetails[0]?.createdAt).toUTCString().slice(5, 16) : "";

                    // last message hour and minute
                    const lastMessageHourMinute = hasLastMessageDetails && `${new Date(item?.lastMessageDetails[0]?.createdAt).getHours()}:${String(new Date(item?.lastMessageDetails[0]?.createdAt).getMinutes()).padStart(2, '0')}`;

                    // final props ------------------------------------------------
                    const lastMessageText = item?.lastMessageDetails?.length > 0 ? item.lastMessageDetails[0].message : "";
                    const lastMessageTime = lastMessageDate === currentDate ? lastMessageHourMinute : lastMessageDate;

                    return (
                      <div className="flex p-2 py-3 justify-between cursor-pointer border-b-2 border-slate-500 hover:bg-slate-500"
                        key={index}
                        onClick={(e) => {
                          setChatInfo(item);
                          setRoomName(item._id);
                        }}>
                        <ChatLabel item={item} lastMessageText={lastMessageText} lastMessageTime={lastMessageTime} />
                      </div>
                    )
                  })
                )
                :
                (
                  <div className="flex justify-center my-10 text-gray-400 p-2">
                    <div className="">
                      <p>No contacts found</p>
                      <p className='text-2xl'>Start chatting</p>
                    </div>
                  </div>
                )
            }
          </div>
      }
    </>
  )
}
