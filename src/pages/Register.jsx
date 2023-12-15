import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../services/helper';

export default function Register() {
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const name = useRef(null);
    const email = useRef(null);
    const password = useRef(null);
    const confirmPassword = useRef(null);
    const navigate = useNavigate();


    const handleSubmit = (event) => {
        event.preventDefault();
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
        if (name.current.value.length > 2 && emailRegex.test(email.current.value) && password.current.value.length >= 6 && password.current.value === confirmPassword.current.value) {

            console.log(formData);
            axios.post(`${BASE_URL}/register`, formData)
                .then((data) => {
                    console.log(data);
                    setError('registration successful!');
                    navigate("/login");
                })
                .catch((error) => {
                    alert(error);
                });

            // upload image to the cloudinary
            uploadImage();

        } else if (!name.current.value.length > 2) {
            setError("name is required");
        } else if (email.current.value.length === 0 && password.current.value.length === 0) {
            setError('Email and password are required!')
        } else if (!emailRegex.test(email.current.value)) {
            setError('Invalid email address')
        } else if (password.current.value.length < 6) {
            setError('Invalid password')
        } else if (!password.current.value === confirmPassword.current.value) {
            setError('password does not matched')
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


    const [imageSelected, setImageSelected] = useState("")
    const uploadImage = () => {
        const formData = new FormData();
        formData.append('file', imageSelected);
        formData.append('upload_preset', "j5quhwqi");
        console.log(imageSelected);

        axios.post('https://api.cloudinary.com/v1_1/domlldpib/image/upload', formData)
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error);
            })

    }

    return (
        <div className='flex justify-center h-[100vh]'>
            <form className="register w-[95%] md:w-[40%] h-[80vh] bg-[url('https://media.istockphoto.com/id/1132930101/photo/leadership-concept-with-paper-airplanes.jpg?s=612x612&w=0&k=20&c=GOzBz1_t9QscdF2F0ZfRkUghMHF6z4F8E1eFH6pCDRo=')] rounded-md flex flex-col justify-center p-10 my-10 space-y-5">
                <p className='text-center text-red-500 text-lg font-semibold h-4'>{error}</p>
                <h1 className='text-3xl font-bold'>Register</h1>
                <input className='p-2 outline-none rounded-sm' type="text" name='name' placeholder='Your name' value={formData.name} onChange={handleInputChange} ref={name} />
                <input className='p-2 outline-none rounded-sm' type="email" name="email" placeholder='Enter Email' value={formData.email} onChange={handleInputChange} ref={email} />
                <input className='p-2 outline-none rounded-sm' type="password" name="password" autoComplete='off' placeholder='Enter Password' value={formData.password} onChange={handleInputChange} ref={password} />
                <input className='p-2 outline-none rounded-sm' type="password" name="confirmPassword" autoComplete='off' id="confirmPassword" placeholder='confirm Password' ref={confirmPassword} />
                <input type="file" name="profilePhoto" id="profilePhoto" onChange={(event) => {
                    setImageSelected(event.target.files[0]);
                }} />
                <button className='bg-orange-500 text-white font-semibold text-lg py-2 rounded-sm' type='submit' onClick={handleSubmit}>Register</button>
                <div className="text-center">Already have account <Link className='text-blue-500 font-semibold' to={"/login"}>Login</Link></div>
            </form>
        </div>
    )
}
