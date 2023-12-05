import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Context } from '../context/Context';
import Cookies from 'js-cookie';


export default function Navbar() {
    const { setIsLogin, user, setUser } = useContext(Context);

    const username = Cookies.get('user');
    const handleLogoutClick = (event) => {
        event.preventDefault();

        Cookies.set('isLogin', false);
        const loginStatus = Cookies.get('isLogin');
        setIsLogin(loginStatus);
        
        Cookies.set('user', user);
        const userStatus = Cookies.get('user');
        setUser(userStatus);

        console.log(Cookies.get('email'))
        Cookies.remove('email'); 
        console.log(Cookies.get('email'))

        // Cookies.remove("isLogin");  // removed login status from cookies
        // Cookies.remove("user");     // removed user from cookies
    }

    return (
        <div className='text-white flex items-center justify-between bg-slate-950 h-16 px-5 md:px-20 sticky top-0 right-0'>
            <Link to='/'><h1 className='text-3xl font-bold'>Chat</h1></Link>
            { }
            {Cookies.get("isLogin") === 'true' && <span className='text-yellow-400'>Login as {username}</span>}
            {
                Cookies.get("isLogin") === 'true' ?
                    <span className='font-semibold'>
                        <Link to='login' onClick={handleLogoutClick}>Logout</Link>
                    </span>
                    :
                    <span className='space-x-4 font-semibold'>
                        <Link to='/register'>Register</Link>
                        <Link to='/login' >Login</Link>
                    </span>
            }
        </div>
    )
}
