import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { baseUrl } from '../utils/helper';
import Cookies from 'js-cookie';
import { IoClose } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

function UserProfilePopup({ closeProfilePopup }) {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate()
    const [hoverCSS, setHoverCSS] = useState("");

    useEffect(() => {
        axios.get(`${baseUrl}/users/${Cookies.get("userId")}`, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${Cookies.get('accessToken')}`,
            }
        })
            .then((response) => {
                console.log(response.data.data)
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
        Cookies.remove("userId");
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        Cookies.remove("name");
        Cookies.remove("isAuthenticated");

        navigate("/login");
    }

    return (
        <div className='fixed inset-0 bg-slate-600 lg:rounded-l-2xl bacckdrop-blur-sm flex flex-col justify-between md:pt-8 md:px-4 md:pb-10 lg:mx-[10%] md:mx-[1%] md:mt-8 md:mb-80 h-max md:h-max md:w-[40%] lg:w-[21.2%]'
            onBlurCapture={closeProfilePopup}>
            <div className="flex justify-end">
                <IoClose className='text-2xl text-black cursor-pointer' onClick={closeProfilePopup} />
            </div>
            <div className="p-4">
                <main className='py-4 border-b-[1px] border-gray-800 space-y-4'>
                    <img className={`block hover:opacity-30 rounded-full cursor-pointer ${hoverCSS}`}
                        src={userData?.profileImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVTtlOwG_6l93Lo3NcGZcQpGx4LXNwa3lF5A&s"}
                        alt="profile photo" width={100} height={100}
                    // onMouseEnter={() => setHoverCSS("")}
                    // onMouseLeave={() => setHoverCSS("")}
                    // onClick={handleProfileImageClick}
                    />
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