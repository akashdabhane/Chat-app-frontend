// this component is responsible for showing information about the chat (other user information like userprofilePopup) or group information
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { baseUrl } from '../utils/helper';
import { IoClose } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";
import Cookies from 'js-cookie';
import { MdAddLink } from "react-icons/md";
import { MdPersonAddAlt1 } from "react-icons/md";


function ChatProfilePopup({ closeChatProfilePopup, otherUserId, chatInfo, setChatInfo }) {
  const [isLoading, setIsLoading] = useState(true);
  const [otherUser, setOtherUser] = useState({});
  const [groupMembers, setGroupMembers] = useState([]);

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

  useEffect(() => {
    if (chatInfo.isGroupChat) {
      axios.get(`${baseUrl}/groups/get-all-group-users/${chatInfo?._id}`, {
        headers: {
          'Authorization': `Bearer ${Cookies.get('accessToken')}`,
        },
        withCredentials: true,
      })
        .then((response) => {
          console.log(response.data.data.participants)
          setGroupMembers(response.data.data.participants);
        })
        .catch((error) => {
          console.log(error);
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

  const handleProfileFileInput = async (file) => {
    if (file) {
      console.log("Selected file: " + file);
      console.log('name: ' + file.name)
      try {
        // Create a FormData object to properly send the file
        const formData = new FormData();
        formData.append("profileImage", file);

        const response = await axios.patch(`${baseUrl}/groups/update-group-profile-image/${chatInfo._id}`, formData, {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${Cookies.get('accessToken')}`
          }
        })
        console.log(response.data)
        setChatInfo(response.data.data.user);
      } catch (error) {
        console.log(error);
        // setError(error);
      }
    } else {
      console.log("No file selected.")
    }
  }

  const handleAddMemberClick = async () => {

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
            <img className={`block rounded-full cursor-pointer text-center h-36 w-36`}
              src={otherUser?.profileImage || chatInfo?.profileImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVTtlOwG_6l93Lo3NcGZcQpGx4LXNwa3lF5A&s"}
              alt="profile photo" width={100} height={100}
            />
            {
              chatInfo?.admin?.includes(Cookies.get('userId')) &&
              <>
                <input type="file" name="profileImage" id="profileImage" className='hidden' onChange={(e) => handleProfileFileInput(e.target.files[0])} />
                <label htmlFor="profileImage" className='relative -bottom-20 right-12'>
                  <MdOutlineEdit htmlFor="profileImage" className='p-2 h-12 w-12 bg-slate-600 rounded-full cursor-pointer' />
                </label>
              </>
            }
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
              <div className="">
                <h3 className='text-xl font-semibold mb-4 '>Group Members:</h3>
                <ul className=''>
                  <li className='flex items-center space-x-2 border-b border-t p-2 cursor-pointer' onClick={handleAddMemberClick}>
                    <MdPersonAddAlt1 className='text-xl' />
                    <span>Add member</span>
                  </li>
                  <li className='flex items-center space-x-2 border-b p-2 cursor-pointer'>
                    <MdAddLink className='text-xl' />
                    <span>Invite to group via link</span>
                  </li>
                  {
                    groupMembers?.map((item, index) => (
                      <li key={index} className={`flex items-center space-x-2 border-b p-2`}>
                        <img className={`rounded-full cursor-pointer text-center w-[32px] h-[32px] mr-4`}
                          src={item?.profileImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVTtlOwG_6l93Lo3NcGZcQpGx4LXNwa3lF5A&s"}
                          alt="profile photo" width={32} height={32}
                        />
                        <p>{item?.name}</p>
                      </li>
                    ))
                  }
                </ul>
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
