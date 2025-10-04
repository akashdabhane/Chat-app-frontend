import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { baseUrl } from '../utils/helper';
import Cookies from 'js-cookie';
import { IoClose } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Context';

function UserProfilePopup({ closeProfilePopup }) {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { loggedInUser } = useAuth();
    const fileInputRef = useRef(null);

    useEffect(() => {
        axios.get(`${baseUrl}/users/${loggedInUser._id}`, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${Cookies.get('accessToken')}`,
            }
        })
            .then((response) => {
                setUserData(response.data.data);
            })
            .catch((error) => {
                console.log(error);
                setError(error);
            })
            .finally(() => {
                setIsLoading(false);
            })
    }, [])

    const handleLogoutClick = () => {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");

        navigate("/login");
    }

    const handleProfileFileInput = async (file) => {
        if (file) {
            try {
                // Create a FormData object to properly send the file
                const formData = new FormData();
                formData.append("profileImage", file);

                const response = await axios.patch(`${baseUrl}/users/update-user-profile-picture`, formData, {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${Cookies.get('accessToken')}`
                    }
                })

                setUserData(response.data.data.user);
            } catch (error) {
                console.log(error);
                setError(error);
            }
        } else {
            console.log("No file selected.")
        }
    }

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-full min-h-[300px]">
                    Loading...
                </div>
            );
        }

        if (error || !userData) {
            return (
                <div className="text-center text-red-400 py-10 px-4">
                    <p className="font-semibold">Something went wrong</p>
                    <p className="text-sm">{error || "Could not retrieve user data."}</p>
                </div>
            );
        }

        return (
            <>
                <div className="p-6 flex flex-col items-center">
                    <div className="relative group mb-4">
                        <img
                            className="h-32 w-32 rounded-full object-cover border-4 border-gray-600 group-hover:opacity-70 transition-opacity"
                            src={userData.profileImage || `https://placehold.co/128x128/1F2937/FFFFFF?text=${userData.name.charAt(0)}`}
                            alt="Profile"
                        />
                        <label
                            htmlFor="profileImage"
                            className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                        >
                            <MdOutlineEdit className="text-3xl" />
                        </label>
                        <input
                            type="file"
                            name="profileImage"
                            id="profileImage"
                            className='hidden'
                            accept="image/*"
                            onChange={(e) => handleProfileFileInput(e.target.files[0])}
                            ref={fileInputRef}
                        />
                    </div>

                    <h3 className="text-xl font-bold text-white">{userData.name}</h3>
                    <p className="text-sm text-gray-400">{userData.email}</p>
                </div>

                <div className="p-4 bg-gray-900/50">
                    <button
                        className="w-full bg-red-600 text-white font-bold rounded-lg px-4 py-2.5 text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
                        onClick={handleLogoutClick}
                    >
                        Logout
                    </button>
                </div>
            </>
        );
    };

    return (
        <div className='fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade-in'>
            <div className='bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col overflow-hidden'>
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className='text-lg font-semibold text-gray-200'>My Profile</h2>
                    <button
                        onClick={closeProfilePopup}
                        className='p-1.5 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors'
                        aria-label="Close"
                    >
                        <IoClose className='text-xl' />
                    </button>
                </div>
                {renderContent()}
            </div>
        </div>
    );
}

export default UserProfilePopup