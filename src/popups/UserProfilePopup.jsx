import axios from 'axios';
import React, { useEffect, useState } from 'react';
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

    return (
        <div className='fixed inset-0 bg-slate-600 lg:rounded-l-2xl bacckdrop-blur-sm flex flex-col justify-between md:pt-8 md:px-4 md:pb-10 lg:mx-[10%] md:mx-[1%] md:mt-8 md:mb-80 h-max md:h-max md:w-[40%] lg:w-[21.2%]'
            onBlurCapture={closeProfilePopup}>
            <div className="flex justify-end">
                <IoClose className='text-2xl text-black cursor-pointer' onClick={closeProfilePopup} />
            </div>
            <div className="p-4">
                <main className='py-4 border-b-[1px] border-gray-800 space-y-4 relative'>
                    <img className={`block hover:opacity-30 rounded-full cursor-pointer h-36 w-36`}
                        src={userData?.profileImage}
                        alt="profile photo" width={100} height={100}
                    // onMouseEnter={() => setHoverCSS("")}
                    // onMouseLeave={() => setHoverCSS("")}
                    // onClick={handleProfileImageClick}
                    />
                    <input type="file" name="profileImage" id="profileImage" className='hidden' onChange={(e) => handleProfileFileInput(e.target.files[0])} />
                    <label htmlFor="profileImage" className='relative bottom-16 -right-24 '>
                        <MdOutlineEdit htmlFor="profileImage" className='p-2 h-12 w-12 bg-slate-600 rounded-full cursor-pointer' />
                    </label>
                    <div className="flex justify-between items-center">
                        <input className='bg-transparent outline-slate-800'
                            type="text" value={userData?.name} contentEditable="false" />
                        <MdOutlineEdit className='p-2 h-8 w-8 hover:bg-slate-600' />
                    </div>
                    <p>
                        <span className='block text-gray-300'>email</span>
                        <span>{userData?.email}</span>
                    </p>
                </main>

                <button className="bg-red-500 text-black rounded px-2 p-1 my-6 text-lg font-semibold"
                    onClick={handleLogoutClick}>
                    Logout
                </button>
            </div>

        </div>
    )
}

export default UserProfilePopup