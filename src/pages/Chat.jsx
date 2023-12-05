import React, { useContext, useEffect, useRef, useState } from 'react'
import { BiSend, BiSearchAlt2 } from 'react-icons/bi';
import { FiMoreVertical } from 'react-icons/fi';
import { BsEmojiSmile } from 'react-icons/bs';
import { AiFillFileAdd } from 'react-icons/ai';
import { Context } from '../context/Context';
import ScrollToBottom from 'react-scroll-to-bottom'
import Cookies from 'js-cookie';
import axios from 'axios';
import LeftPanel from '../components/LeftPanel';
import ChatWindow from '../components/ChatWindow';
import TopUserBar from '../components/TopUserBar';
import '../styles/index.css'
// import { Picker } from 'emoji-mart';
// import 'emoji-mart/css/emoji-mart.css';


export default function Chat({ children }) {
    const { socket } = useContext(Context);         // , user, email
    const [message, setMessage] = useState("");
    const [chatPanel, setChatPanel] = useState([]);
    const [users, setUsers] = useState([]);
    const [userData, setUserData] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [otherUser, setOtherUser] = useState('');
    const [roomName, setRoomName] = useState("general");
    const inputRef = useRef(null);
    const searchBox = useRef(null);

    const handleSendClick = async () => {
        if (message !== "") {
            const messageData = {
                author: Cookies.get('user'),
                message: message,
                room: roomName,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            }

            console.log(roomName);
            // if (roomName !== "") {
            //     console.log('room is not empty');
            //     await socket.emit("send_message", roomName, messageData);
            // } else {
            await socket.emit("send_message", messageData);
            // }
            setChatPanel([...chatPanel, messageData]);
            setMessage("");
        }
    }

    const handleTextInput = (event) => {
        setMessage(event.target.value);
        inputRef.current.value.length > 0 && setIsTyping(true);
    }


    // useEffect(() => {
    //     // let intervalId = setInterval(() => {
    //     //     const userCurrentData = {
    //     //         isActive: isActive,
    //     //         isTyping: isTyping,
    //     //     }
    //     //     socket.emit("send_userdata", userCurrentData);
    //     // }, 5000);
    // }, [intervalId])


    useEffect(() => {
        axios.get('http://localhost:9000/')
            .then((data) => {
                setUsers(data.data);
            })
            .catch(error => {
                alert('Error occured', error);
            })

        console.log(users);
        socket.on("receive_message", (data) => {
            setChatPanel([...chatPanel, data]);
        });

        socket.on("receive_userdata", (data) => {
            setUserData([...userData, data]);
        });

        socket.on('connect', () => {
            setIsActive(true);

            socket.on('disconnect', () => {
                setIsActive(false);
                // clearInterval(intervalId);
            });
        });
    }, [socket, chatPanel, userData]);


    useEffect(() => {
        // This code will execute whenever otherUser changes
        setChatPanel([]);
        if (otherUser !== "") {
            console.log(otherUser); // This will have the updated value
            socket.emit('leaveRoom', roomName);
            setRoomName(createRoomName(Cookies.get('email'), otherUser.email));
            console.log(roomName);
            // join the room for specific user
        }

        console.log(roomName);
        console.log(otherUser);
    }, [otherUser]);

    useEffect(() => {
        // if (roomName !== "general") {
        socket.emit("join_room", roomName);
        // }
    }, [roomName])


    // Generate a unique room name for two users
    const createRoomName = (user1, user2) => {
        // Sort the usernames alphabetically to ensure consistency
        const sortedUsernames = [user1, user2].sort();

        // Combine the usernames with a separator (e.g., '-')
        const roomName = sortedUsernames.join('-');
        console.log(roomName);
        return roomName;
    };


    return (
        <div className=' lg:mx-[16%] md:mx-[1%] md:mt-2 md:pb-8 flex h-[93vh] md:h-[90vh] text-white'>
            <div className="chats md:w-[40%] lg:w-[36%] hidden md:block bg-slate-700">
                <div className="flex items-center p-3 justify-between border-b-2 border-slate-500">
                    <input className='w-full px-2 p-1 text-md outline-none border-none bg-slate-600 rounded' type="text" name="searchUser" id="searchUser" placeholder='search here...' ref={searchBox} />
                    <span className='text-lg flex items-center px-2 space-x-2 '>
                        <BiSearchAlt2 className='w-full cursor-pointer' onClick={() => {
                            searchBox.current.focus();
                        }} />
                        <FiMoreVertical className='text-3xl cursor-pointer' />
                    </span>
                </div>
                <LeftPanel users={users} setOtherUser={setOtherUser} />
            </div>
            <div className="room bg-slate-500 w-full flex flex-col justify-between">
                <TopUserBar userData={userData} otherUser={otherUser} />
                <ScrollToBottom className="showMessages h-[90%] w-[100%] overflow-x-hidden flex flex-col ">
                    <ChatWindow chatPanel={chatPanel} />
                </ScrollToBottom>
                <div className="inputs flex items-center border-t-2 bg-slate-700 border-gray-800 space-x-1 p-1 pr-4">
                    <label className='px-4 p-2 cursor-pointer hover:bg-slate-900 rounded-md' htmlFor="emoji"><BsEmojiSmile /></label>
                    <input className='hidden' type="file" name="emoji" id="emoji" />
                    {/* <Picker/> */}
                    <label className='px-4 p-2 cursor-pointer hover:bg-slate-900 rounded-md' htmlFor="file"><AiFillFileAdd /></label>
                    <input className='hidden' type="file" name="file" id="file" />
                    <input className='w-full p-2 py-1 text-lg rounded text-black outline-none border-none' type="text" placeholder='type here...' value={message} onKeyDown={(event) => event.key === "Enter" && handleSendClick()} onChange={handleTextInput} ref={inputRef} />
                    <BiSend className='text-4xl bg-green-500 p-1 rounded cursor-pointer' onClick={handleSendClick} />
                </div>
            </div>
        </div >
    )
}


