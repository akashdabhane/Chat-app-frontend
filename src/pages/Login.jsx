import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/Context';
import axios from 'axios'
import { useFormik } from 'formik'
import { loginSchema } from '../validationSchema/loginSchema';
import { baseUrl } from '../utils/helper';
import Cookies from 'js-cookie';

export default function Login() {
    const [error, setError] = useState('');
    const { setIsAuthenticated } = useAuth();
    const navigate = useNavigate();


    // using formik for handling input fields
    const initialValues = {
        email: "",
        password: "",
    };

    // values, handleBlur, handleChange, handleSubmit, errors, touched
    // By disabling validation onChange and onBlur formik will validate on submit.
    const formik = useFormik({
        initialValues,
        validationSchema: loginSchema,
        validateOnChange: true,
        validateOnBlur: false,
        onSubmit: (values, action) => {
            console.log(values)
            handleLogin(values);    // function to handle login 

            // to get rid of all the values after submitting the form
            action.resetForm();
        }
    })

    const handleLogin = async (formData) => {
        try {
            const response = await axios.post(`${baseUrl}/users/login`, formData, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${Cookies.get('accessToken')}`,
                }
            })
            console.log(response.data.data)
            if (response.status === 200) {
                setError('login successful!');
                Cookies.set('accessToken', response.data.data.accessToken, { expires: 1 }); // set token in cookies
                Cookies.set('refreshToken', response.data.data.refreshToken, { expires: 1 }); // set token in cookies
                Cookies.set('name', response.data.data.user.name, { expires: 1 }); // set username in cookies
                Cookies.set('userId', response.data.data.user._id, { expires: 1 });
                Cookies.set("isAuthenticated", true, { expires: 1 });
                setIsAuthenticated(true);
                navigate("/");
            } else {
                setError('Invalid email or password');
            }
        } catch (error) {
            setError(error.message || 'Error occured while logging in');
        }
    }

    return (
        <div className='flex justify-center h-[100vh]'>
            <form onSubmit={formik.handleSubmit}
                className="login w-[95%] md:w-[40%] h-[80vh] rounded-md flex flex-col justify-center p-10 mt-10 space-y-5  bg-[url('https://media.istockphoto.com/id/1132930101/photo/leadership-concept-with-paper-airplanes.jpg?s=612x612&w=0&k=20&c=GOzBz1_t9QscdF2F0ZfRkUghMHF6z4F8E1eFH6pCDRo=')]">
                <p className='text-center text-red-500 text-lg font-semibold h-4'>{error}</p>
                <h1 className='text-3xl font-bold'>Login</h1>
                <div className="">
                    <input className='p-2 outline-none rounded-sm w-full' type="email" name="email" id="email" placeholder='Enter Email/Mobile Number'
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur} />

                    {
                        formik.touched.email && formik.errors.email ?
                            <p className="text-red-600">{formik.errors.email}</p>
                            : null
                    }
                </div>
                <div className="">
                    <input className='p-2 outline-none rounded-sm w-full' type="password" name="password" id="password" autoComplete='off' placeholder='Enter Password'
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur} />
                    {
                        formik.touched.password && formik.errors.password ?
                            <p className="text-red-600">{formik.errors.password}</p>
                            : null
                    }
                </div>
                <button className='bg-orange-500 text-white font-semibold text-lg py-2 rounded-sm' type='submit'>Login</button>
                <div className="text-center">Not have account <Link className='text-blue-500 font-semibold' to={"/register"}>Register</Link></div>
            </form>
        </div>
    )
}
