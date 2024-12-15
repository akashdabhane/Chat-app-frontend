import { createContext, useContext, useState } from "react";
import io from 'socket.io-client';

const serverUrl = 'http://localhost:9000';
// const serverUrl = 'https://chatappbackend-kkuy.onrender.com';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [chatInfo, setChatInfo] = useState(null);
    const [newMessageReceived, setNewMessageReceived] = useState(false);
    const socket = io(serverUrl, {
        withCredentials: true,
    });

    return (
        <AuthContext.Provider
            value={{ loggedInUser, setLoggedInUser, chatInfo, setChatInfo, socket, newMessageReceived, setNewMessageReceived }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);