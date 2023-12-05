import React, { useContext, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Context } from '../context/Context';
import Cookies from 'js-cookie';
import axios from 'axios';

export default function Login() {
    const [error, setError] = useState('');
    const [user, setUser] = useState("");
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { setIsLogin, setEmail } = useContext(Context);
    const email = useRef(null);
    const password = useRef(null);
    const navigate = useNavigate();

    const handleButtonClick = () => {
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
        if (emailRegex.test(email.current.value) && password.current.value.length >= 6) {
            console.log(formData); 
            try {
                axios.post('http://localhost:9000/login', formData)
                    .then(data => {
                        setError('login successful!');
                        navigate("/");
                        Cookies.set('email', data.data.email, { expires: 1}); 

                        Cookies.set('isLogin', true, { expires: 1 });
                        const loginStatus = Cookies.get('isLogin');
                        setIsLogin(loginStatus);
    
                        Cookies.set('user', data.data.name, { expires: 1 });
                        const userStatus = Cookies.get('user');
                        setUser(data.name);
                        
                    })
                    .catch(error => {
                        setError(error);
                    })
                
            } catch (error) {
                console.log('error occured')
            }


            // setIsLogin(Cookies.get('isLogin'));
            // Cookies.set('isLogin', true, { expires: 1 });    // cookies to store login status, will expire after 1 day
            // Cookies.set('user', user, { expires: 1 });

        } else if (email.current.value.length === 0 && password.current.value.length === 0) {
            setError('All fields are required!')
        } else if (!emailRegex.test(email.current.value)) {
            setError('Invalid email address')
        } else if (password.current.value.length < 6) {
            setError('Invalid password')
        }
    }


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
        console.log(formData);
    }

    return (
        <div className='flex justify-center h-[100vh]'>
            <form className="login w-[95%] md:w-[40%] h-[80vh] rounded-md flex flex-col justify-center p-10 mt-10 space-y-5  bg-[url('https://media.istockphoto.com/id/1132930101/photo/leadership-concept-with-paper-airplanes.jpg?s=612x612&w=0&k=20&c=GOzBz1_t9QscdF2F0ZfRkUghMHF6z4F8E1eFH6pCDRo=')]">
                <p className='text-center text-red-500 text-lg font-semibold h-4'>{error}</p>
                <h1 className='text-3xl font-bold'>Login</h1>
                <input className='p-2 outline-none rounded-sm' type="email" name="email" id="email" placeholder='Enter Email/Mobile Number' onChange={handleInputChange} ref={email} />
                <input className='p-2 outline-none rounded-sm' type="password" name="password" id="password" autoComplete='off' placeholder='Enter Password' onChange={handleInputChange} ref={password} />
                <button className='bg-orange-500 text-white font-semibold text-lg py-2 rounded-sm' type='button' onClick={handleButtonClick}>Login</button>
                <div className="text-center">Not have account <Link className='text-blue-500 font-semibold' to={"/register"}>Register</Link></div>
            </form>
        </div>
    )
}
