// this component is responsible for showing information about the chat (other user information like userprofilePopup) or group information
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { baseUrl } from '../utils/helper';
import { IoClose } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";
import Cookies from 'js-cookie';
import { MdAddLink } from "react-icons/md";
import { MdPersonAddAlt1 } from "react-icons/md";
import { useAuth } from '../context/Context';

function ChatProfilePopup({ closeChatProfilePopup, otherUserId }) {
  const [isLoading, setIsLoading] = useState(true);
  const [otherUser, setOtherUser] = useState({});
  const [groupMembers, setGroupMembers] = useState([]);
  const { chatInfo, setChatInfo, loggedInUser } = useAuth();

  let secondUserId;
  useEffect(() => {
    if (!chatInfo.isGroupChat) {
      const secondUser = (obj) => {
        return obj.participants.find(item => item._id !== loggedInUser._id);
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
        userId: loggedInUser._id,
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

  if (!chatInfo) return null;

  const profileImage = chatInfo.isGroupChat ? chatInfo.profileImage : otherUser.profileImage;
  const displayName = chatInfo.isGroupChat ? chatInfo.name : otherUser.name;
  const displayInitial = displayName ? displayName.charAt(0).toUpperCase() : '?';
  const isAdmin = chatInfo.isGroupChat && chatInfo.admin?.includes(loggedInUser._id);

  return (
    <div className='fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div className='bg-gray-800 text-white rounded-2xl shadow-2xl w-full max-w-sm flex flex-col max-h-[90vh]'>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-bold">{chatInfo.isGroupChat ? "Group Info" : "Contact Info"}</h2>
          <button onClick={closeChatProfilePopup} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
            <IoClose className='text-xl' />
          </button>
        </div>

        {/* Body */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : (
            <>
              {/* Profile Image Section */}
              <div className="flex flex-col items-center space-y-2">
                <div className="relative">
                  {profileImage ? (
                    <img className="w-32 h-32 rounded-full object-cover" src={profileImage} alt="Profile" />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold text-5xl">
                      {displayInitial}
                    </div>
                  )}
                  {isAdmin && (
                    <>
                      <input type="file" accept="image/*" id="profileImageUpload" className='hidden' onChange={(e) => handleProfileFileInput(e.target.files[0])} />
                      <label htmlFor="profileImageUpload" className='absolute bottom-0 right-0 bg-gray-700 p-2 rounded-full cursor-pointer hover:bg-gray-600 border-2 border-gray-800'>
                        <MdOutlineEdit />
                      </label>
                    </>
                  )}
                </div>
                <h3 className="text-2xl font-bold">{displayName}</h3>
              </div>

              {/* Details Section */}
              {chatInfo.isGroupChat ? (
                // Group Info
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Description</p>
                    <p>{chatInfo.description || "No description."}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Created On</p>
                    <p>{new Date(chatInfo.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">{groupMembers.length} Members</h4>
                    <ul className="space-y-1 max-h-48 overflow-y-auto pr-2">
                      {isAdmin && (<>
                        <li className="flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-gray-700"><MdPersonAddAlt1 /><span>Add member</span></li>
                        <li className="flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-gray-700"><MdAddLink /><span>Invite via link</span></li>
                      </>)}
                      {groupMembers.map(member => (
                        <li key={member._id} className="flex items-center space-x-3 p-2">
                          <img className="w-8 h-8 rounded-full" src={member.profileImage} alt={member.name} />
                          <span>{member.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                // Single User Info
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p>{otherUser.email}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-700 flex-shrink-0">
          <button
            onClick={chatInfo.isGroupChat ? handleExitGroupClick : handleBlockUserClick}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            {chatInfo.isGroupChat ? "Exit Group" : "Block User"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatProfilePopup;
