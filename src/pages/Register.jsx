import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useFormik } from 'formik';
import { registrationSchema } from '../validationSchema/registrationSchema';
import { baseUrl } from '../utils/helper';
import { FiMail, FiEye, FiEyeOff, FiLock, FiUser, FiUserPlus } from "react-icons/fi";

export default function Register() {
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // using formik for handling input fields
    const initialValues = {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    };

    // values, handleBlur, handleChange, handleSubmit, errors, touched
    const formik = useFormik({
        initialValues,
        validationSchema: registrationSchema,
        validateOnChange: true,
        validateOnBlur: false,
        // By disabling validation onChange and onBlur formik will validate on submit.
        onSubmit: (values, action) => {
            // Remove confirmPassword before sending to API
            const { confirmPassword, ...registerData } = values;
            handleRegister(registerData);
            
            // to get rid of all the values after submitting the form
            action.resetForm();
        }
    })

    const handleRegister = async (formData) => {
        setLoading(true);
        setError(''); // Clear any previous errors
        
        try {
            const response = await axios.post(`${baseUrl}/users/register`, formData, {
                withCredentials: true // Important for cookies
            });
            
            if (response?.status === 201) {
                // Registration successful, navigate to login
                navigate("/login");
            } else {
                setError('Registration failed. Please try again.');
            }
        } catch (error) {
            // Handle different types of errors
            if (error.response) {
                // Server responded with error status
                const statusCode = error.response.status;
                const errorMessage = error.response.data?.message || error.response.data?.error || 'An error occurred';
                
                switch (statusCode) {
                    case 400:
                        setError(errorMessage || 'All fields are required');
                        break;
                    case 409:
                        setError('User with this email already exists');
                        break;
                    case 500:
                        setError('Server error. Please try again later.');
                        break;
                    default:
                        setError(errorMessage || 'Registration failed. Please try again.');
                }
            } else if (error.request) {
                // Request was made but no response received
                setError('Network error. Please check your internet connection and try again.');
            } else {
                // Something else happened
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full bg-gray-900 text-white flex items-center justify-center font-sans p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-6xl mx-auto h-full lg:h-auto lg:max-h-[800px] bg-gray-800 rounded-xl shadow-2xl overflow-hidden">

                <div className="hidden lg:flex flex-col justify-center items-center p-12 bg-gradient-to-br from-cyan-500 to-blue-600 text-center">
                    <h1 className="text-4xl font-bold mb-4">Join Our Community</h1>
                    <p className="text-blue-100">
                        Create an account to start connecting with people. It's fast and easy.
                    </p>
                    <FiUserPlus className="text-4xl text-white/20 mt-8" />
                </div>

                <div className="p-8 md:p-12 flex flex-col justify-center">
                    <form onSubmit={formik.handleSubmit} className="w-full space-y-6">
                        <h2 className='text-3xl font-bold text-cyan-400 mb-2'>Create a New Account</h2>
                        <p className="text-gray-400 mb-8">Let's get you set up.</p>

                        {error && (
                            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center" role="alert">
                                {error}
                            </div>
                        )}

                        {/* Name Input */}
                        <div className="">
                            <div className={`flex items-center bg-gray-700 border-2 ${formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-600'} rounded-lg p-3 text-white placeholder-gray-400`}>
                                <FiUser className=" text-gray-400 w-5 h-5" />
                                <input
                                    className={`w-full pl-4 bg-gray-700 border-none outline-none`}
                                    type="text" name='name' placeholder='Your Name'
                                    value={formik.values.name}
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                        if (error) setError(''); // Clear error when user starts typing
                                    }}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.name && formik.errors.name && (<p className="text-red-400 text-sm mt-1 ml-1">{formik.errors.name}</p>)}
                        </div>

                        {/* Email Input */}
                        <div className="">
                            <div className={`flex items-center bg-gray-700 border-2 ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-600'} rounded-lg p-3 text-white placeholder-gray-400 `}>
                                <FiMail className="text-gray-400 w-5 h-5" />
                                <input
                                    className={`w-full pl-4 bg-gray-700 border-none outline-none`}
                                    type="email" name="email" placeholder='Email Address'
                                    value={formik.values.email}
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                        if (error) setError(''); // Clear error when user starts typing
                                    }}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.email && formik.errors.email && (<p className="text-red-400 text-sm mt-1 ml-1">{formik.errors.email}</p>)}
                        </div>

                        {/* Password Input */}
                        <div className="">
                            <div className={`flex items-center bg-gray-700 border-2 ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-600'} rounded-lg p-3 text-white placeholder-gray-400 `}>
                                <FiLock className="text-gray-400 w-5 h-5" />
                                <input
                                    className={`w-full pl-4 border-none outline-none bg-gray-700`}
                                    type={showPassword ? "text" : "password"}
                                    name="password" placeholder='Create Password'
                                    value={formik.values.password}
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                        if (error) setError(''); // Clear error when user starts typing
                                    }}
                                    onBlur={formik.handleBlur}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-cyan-400 transition-colors">
                                    {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                                </button>
                            </div>
                            {formik.touched.password && formik.errors.password && (<p className="text-red-400 text-sm mt-1 ml-1">{formik.errors.password}</p>)}
                        </div>

                        {/* Confirm Password Input */}
                        <div className="">
                            <div className={`flex items-center bg-gray-700 border-2 ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : 'border-gray-600'} rounded-lg p-3 text-white placeholder-gray-400 `}>
                                <FiLock className="text-gray-400 w-5 h-5" />
                                <input
                                    className={`w-full bg-gray-700 border-2 border-none outline-none pl-3`}
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword" placeholder='Confirm Password'
                                    value={formik.values.confirmPassword}
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                        if (error) setError(''); // Clear error when user starts typing
                                    }}
                                    onBlur={formik.handleBlur}
                                />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-gray-400 hover:text-cyan-400 transition-colors">
                                    {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                                </button>
                            </div>
                            {formik.touched.confirmPassword && formik.errors.confirmPassword && (<p className="text-red-400 text-sm mt-1 ml-1">{formik.errors.confirmPassword}</p>)}
                        </div>

                        <button
                            className='w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg py-3 rounded-lg shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed'
                            type='submit'
                            disabled={loading}
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                'Create Account'
                            )}
                        </button>

                        <div className="text-center text-gray-400">
                            Already have an account?{' '}
                            <Link className='text-cyan-400 font-semibold hover:underline' to={"/login"}>
                                Login here
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
