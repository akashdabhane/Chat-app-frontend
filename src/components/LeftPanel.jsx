import React, { useState, useRef, useEffect } from 'react';
import Cookies from 'js-cookie';
import { FiMoreVertical } from 'react-icons/fi';
import { BiSearchAlt2 } from "react-icons/bi";
import ContactListSkeleton from '../loadingSkeleton/ContactListSkeleton';
import axios from 'axios';
import { baseUrl } from '../utils/helper';


export default function LeftPanel({ handleChatOnClick, setShowUserProfile }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchBox = useRef(null);

  // use effects 
  useEffect(() => {
    axios.get(`${baseUrl}/chats/get-connected-chats`, {
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
      })
  }, []);


  // search for users 
  const handleSearchClick = async (inputText) => {
    try {
      // users could be zero(not found anything), one or more if inputText is email then we one user 
      // and if inputText is simple text then app will search by username and then return list of users
      const users = await axios.get(`${baseUrl}/users/search?inputText=${inputText}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`
        },
        withCredentials: true
      })

      setUsers(users.data.data)
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <>
      {
        isLoading ?
          <ContactListSkeleton />
          :
          <div className="chats md:w-[40%] lg:w-[36%] md:block bg-slate-700 lg:rounded-l-2xl">
            <div className="flex items-center p-3 justify-between border-b-2 border-slate-500">
              <input className='w-full px-2 p-1 text-md outline-none border-none bg-slate-600 rounded'
                type="text" name="searchUser" id="searchUser" placeholder='search here...' ref={searchBox}
              />
              <span className='text-lg flex items-center px-2 space-x-2 '>
                <BiSearchAlt2 className='w-full cursor-pointer' onClick={() => {
                  searchBox.current.value === "" ?
                    searchBox.current.focus()
                    :
                    handleSearchClick(searchBox.current.value);
                }} />
                <FiMoreVertical className='text-3xl cursor-pointer' onClick={() => setShowUserProfile(true)} />
              </span>
            </div>
            {
              (users?.length > 0) && (
                users.map((item, index) => {
                  // // Check if lastMessageDetails exists and has elements
                  const hasLastMessageDetails = item?.lastMessageDetails?.length > 0;
                  const currentDate = new Date(Date.now()).toUTCString().slice(5, 16);

                  // Default to an empty string if no lastMessageDetails
                  const lastMessageDate = hasLastMessageDetails ? new Date(item?.lastMessageDetails[0]?.createdAt).toUTCString().slice(5, 16) : "";

                  // last message hour and minute
                  const lastMessageHourMinute = hasLastMessageDetails && `${new Date(item?.lastMessageDetails[0]?.createdAt).getHours()}:${String(new Date(item?.lastMessageDetails[0]?.createdAt).getMinutes()).padStart(2, '0')}`;

                  return (
                    <div className="flex p-2 py-3 justify-between cursor-pointer border-b-2 border-slate-500 hover:bg-slate-500" key={index} onClick={(e) => handleChatOnClick(item)}>    {/*   */}
                      <div className="space-x-2 flex w-60">
                        {
                          item?.isGroupChat ?
                            <img className='rounded-[50%] w-10 h-10' src={item?.profileImage} alt="profileImg" />
                            :
                            (
                              item?.participants ?
                                <img className='rounded-[50%] w-10 h-10' src={(item?.participants[1]?.name === Cookies.get('name') ? item?.participants[0]?.profileImage : item?.participants[1]?.profileImage)} alt="profileImg" />
                                :
                                <img className='rounded-[50%] w-10 h-10' src={item?.profileImage} alt="profileImage" />
                            )
                        }
                        <div className="leading-5">
                          {
                            item.isGroupChat ?
                              <p>{item?.name}</p>
                              :
                              // {
                              (
                                item?.participants ?
                                  <p>{item?.participants[1]?.name === Cookies.get('name') ? item?.participants[0]?.name : item?.participants[1]?.name}</p>
                                  :
                                  <p>{item.name}</p>
                              )
                            // }
                          }
                          {
                            <span className='text-gray-300 text-sm line-clamp-1'>
                              {
                                item?.lastMessageDetails?.length > 0
                                  ? item.lastMessageDetails[0].message
                                  : ""
                              }
                            </span>
                          }
                        </div>
                      </div>
                      <div className='text-xs'>
                        {
                          lastMessageDate === currentDate
                            ? lastMessageHourMinute
                            : lastMessageDate
                        }
                      </div>
                    </div>
                  )
                })
              )
            }
          </div>
      }
    </>
  )
}

