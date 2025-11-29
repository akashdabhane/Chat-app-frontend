import { createContext, useContext, useState, useRef } from "react";
import io from 'socket.io-client';

// const serverUrl = 'http://localhost:9000';
const serverUrl = 'https://chatappbackend-kkuy.onrender.com';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [chatInfo, setChatInfo] = useState(null);
    const [newMessageReceived, setNewMessageReceived] = useState(false);
    const socket = io(serverUrl, {
        withCredentials: true,
    });
    
    // Ref to store the function that updates chat list in LeftPanel
    const updateChatListRef = useRef(null);

    const setUpdateChatListFunction = (fn) => {
        updateChatListRef.current = fn;
    };

    const updateChatList = (roomName, messageData) => {
        if (updateChatListRef.current) {
            updateChatListRef.current(roomName, messageData);
        }
    };

    return (
        <AuthContext.Provider
            value={{ 
                loggedInUser, 
                setLoggedInUser, 
                chatInfo, 
                setChatInfo, 
                socket, 
                newMessageReceived, 
                setNewMessageReceived,
                setUpdateChatListFunction,
                updateChatList
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);