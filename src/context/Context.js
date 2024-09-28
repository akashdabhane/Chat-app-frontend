import { createContext, useContext, useState } from "react"
import io from 'socket.io-client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const socket = io("https://chatappbackend-kkuy.onrender.com", {
        withCredentials: true,
    });

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, socket}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);