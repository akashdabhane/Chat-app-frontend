import React, { useContext, useEffect, useRef, useState } from 'react'
import { BiSend, BiSearchAlt2 } from 'react-icons/bi';
import { FiMoreVertical } from 'react-icons/fi';
import { BsEmojiSmile } from 'react-icons/bs';
import { AiFillFileAdd } from 'react-icons/ai';
import { useAuth } from '../context/Context';
import { IoChatbox } from "react-icons/io5";
import { CiLock } from "react-icons/ci";
import ScrollToBottom from 'react-scroll-to-bottom'
import Cookies from 'js-cookie';
import axios from 'axios';
import LeftPanel from '../components/LeftPanel';
import ChatWindow from '../components/ChatWindow';
import TopUserBar from '../components/TopUserBar';
import '../styles/index.css'
import { baseUrl } from '../utils/helper';
import ContactListSkeleton from '../loadingSkeleton/ContactListSkeleton';
import UserProfilePopup from '../popups/UserProfilePopup';
// import { Picker } from 'emoji-mart';
// import 'emoji-mart/css/emoji-mart.css';


export default function Chat({ socket }) {
    const [message, setMessage] = useState("");
    const [chatMessageList, setChatMessageList] = useState([]);
    const [users, setUsers] = useState([]);
    const [userData, setUserData] = useState([]);
    // const [isTyping, setIsTyping] = useState(false);
    // const [isActive, setIsActive] = useState(false);
    const [chatInfo, setChatInfo] = useState({});
    const [roomName, setRoomName] = useState("");
    const searchBox = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showUserProfile, setShowUserProfile] = useState(false);

    // use effects 
    useEffect(() => {
        axios.get(`${baseUrl}/chats/get-connected-chats`, {
            headers: {
                Authorization: `Bearer ${Cookies.get("accessToken")}`
            },
            withCredentials: true
        })
            .then((data) => {
                console.log(data.data.data)
                setUsers(data.data.data);
            })
            .catch(error => {
                alert('Error occured', error.message);
                console.log(error)
            })
            .finally(() => {
                setIsLoading(false);
            })
    }, []);


    useEffect(() => {
        console.log(users);

        socket.on("receive_message", (data) => {
            setChatMessageList([...chatMessageList, data.messageData]);
        });

        socket.on("receive_userdata", (data) => {
            setUserData([...userData, data]);
        });

        socket.on('connect', () => {
            // setIsActive(true);

            socket.on('disconnect', () => {
                // setIsActive(false);
                // clearInterval(intervalId);
            });
        });
    }, [socket, chatMessageList, userData])


    useEffect(() => {
        console.log(chatInfo);

        if (Object.keys(chatInfo).length > 0) {
            console.log(chatInfo);
            setRoomName(chatInfo._id);
        }

        axios.get(`${baseUrl}/chats/get-messages-list/${chatInfo._id}`, {
            headers: {
                Authorization: `Bearer ${Cookies.get("accessToken")}`
            },
            withCredentials: true
        })
            .then((response) => {
                console.log(response);
                setChatMessageList(response.data.data);
            })
            .catch((error) => {
                console.log(error);
            })

    }, [chatInfo]);

    useEffect(() => {
        console.log(roomName);
        if (roomName !== "") {
            socket.emit("join_room", roomName);
            console.log('93 room joined successfully', roomName);
        }
    }, [roomName]);


    const handleChatOnClick = (obj) => {
        setChatInfo(obj);
    }


    const handleSendClick = () => {
        if (message !== "") {
            const messageData = {
                author: Cookies.get('userId'),
                message: message,
                room: roomName,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            }

            console.log(roomName);
            if (roomName !== "") {
                console.log('room is not empty');
                socket.emit("send_message", { roomName, messageData });
            } else {
                alert('failed to send message');
            }

            setChatMessageList([...chatMessageList, messageData]);
            setMessage("");
        }
    }

    const handleSearchClick = async (inputText) => {
        try {
            const user = await axios.get(`${baseUrl}/users/search?inputText=${inputText}`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get("accessToken")}`
                },
                withCredentials: true
            })

            console.log(user);
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <>
            <div className='lg:mx-[10%] md:mx-[1%] md:pt-8 md:pb-8 flex h-[93vh] md:h-[97vh] text-white'>
                <div className="chats md:w-[40%] lg:w-[36%] hidden md:block bg-slate-700 lg:rounded-l-2xl">
                    <div className="flex items-center p-3 justify-between border-b-2 border-slate-500">
                        <input className='w-full px-2 p-1 text-md outline-none border-none bg-slate-600 rounded' type="text" name="searchUser" id="searchUser" placeholder='search here...' ref={searchBox} />
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
                        isLoading ?
                            <ContactListSkeleton />
                            :
                            <LeftPanel users={users} setChatInfo={setChatInfo} handleChatOnClick={handleChatOnClick} />
                    }
                </div>
                <div className="room bg-slate-500 w-full flex flex-col justify-between lg:rounded-r-2xl">
                    {
                        Object.keys(chatInfo).length === 0 ?
                            (
                                <div className="text-slate-700 flex flex-col items-center justify-center h-full">
                                    <IoChatbox className='text-4xl' />
                                    <p>Send and receive messages using chatapp</p>
                                    <p className='flex items-center space-x-2'>
                                        <CiLock className='font-bold' />
                                        <span>End-to-end encryption</span>
                                    </p>
                                </div>
                            )
                            :
                            (
                                <>
                                    <TopUserBar userData={userData} chatInfo={chatInfo} setChatInfo={setChatInfo} />
                                    <ScrollToBottom className="showMessages h-[90%] w-[100%] overflow-x-hidden flex flex-col ">
                                        <ChatWindow chatMessageList={chatMessageList} chatInfo={chatInfo} />
                                    </ScrollToBottom>
                                    <div className="inputs flex items-center border-t-2 bg-slate-700 border-gray-800 space-x-1 p-1 pr-4 lg:rounded-br-2xl">
                                        <label className='px-4 p-2 cursor-pointer hover:bg-slate-900 rounded-md' htmlFor="emoji"><BsEmojiSmile /></label>
                                        <input className='hidden' type="file" name="emoji" id="emoji" />
                                        {/* <Picker/> */}
                                        <label className='px-4 p-2 cursor-pointer hover:bg-slate-900 rounded-md' htmlFor="file"><AiFillFileAdd /></label>
                                        <input className='hidden' type="file" name="file" id="file" />
                                        <input className='w-full p-2 py-1 text-lg rounded text-black outline-none border-none' type="text" placeholder='type here...' value={message} onKeyDown={(event) => event.key === "Enter" && handleSendClick()} onChange={(e) => setMessage(e.target.value)} />
                                        <BiSend className='text-4xl bg-green-500 p-1 rounded cursor-pointer' onClick={handleSendClick} />
                                    </div>
                                </>
                            )
                    }
                </div>
                {
                    showUserProfile && <UserProfilePopup closeProfilePopup={() => setShowUserProfile(false)} />
                }
            </div >
        </>
    )
}


