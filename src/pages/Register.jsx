import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useFormik } from 'formik';
import { registrationSchema } from '../validationSchema/registrationSchema';
import { baseUrl } from '../utils/helper';

export default function Register() {
    const [formData, setFormData] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

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
            console.log(values);
            setFormData(values);

            // to get rid of all the values after submitting the form
            action.resetForm();
        }
    })


    useEffect(() => {
        console.log(formData);
        if (formData !== null) {
            try {
                axios.post(`${baseUrl}/register`, formData)
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
            } catch (error) {
                console.log(error);
            }
        }
    }, [])


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
            <form onSubmit={formik.handleSubmit}
                className="register w-[95%] md:w-[40%] h-[80vh] bg-[url('https://media.istockphoto.com/id/1132930101/photo/leadership-concept-with-paper-airplanes.jpg?s=612x612&w=0&k=20&c=GOzBz1_t9QscdF2F0ZfRkUghMHF6z4F8E1eFH6pCDRo=')] rounded-md flex flex-col justify-center p-10 my-10 space-y-5">
                <p className='text-center text-red-500 text-lg font-semibold h-4'>{error}</p>
                <h1 className='text-3xl font-bold'>Register</h1>
                <div className="">
                    <input className='p-2 outline-none rounded-sm w-full' type="text" name='name' placeholder='Your name'
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur} />

                    {
                        formik.touched.name && formik.errors.name ?
                            <p className="text-red-600">{formik.errors.name}</p>
                            : null
                    }

                </div>
                <div className="">
                    <input className='p-2 outline-none rounded-sm w-full' type="email" name="email" placeholder='Enter Email'
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
                    <input className='p-2 outline-none rounded-sm w-full' type="password" name="password" autoComplete='off' placeholder='Enter Password'
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur} />

                    {
                        formik.touched.password && formik.errors.password ?
                            <p className="text-red-600">{formik.errors.password}</p>
                            : null
                    }

                </div>
                <div className="">
                    <input className='p-2 outline-none rounded-sm w-full' type="password" name="confirmPassword" autoComplete='off' id="confirmPassword" placeholder='confirm Password'
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur} />

                    {
                        formik.touched.confirmPassword && formik.errors.confirmPassword ?
                            <p className="text-red-600">{formik.errors.confirmPassword}</p>
                            : null
                    }

                </div>
                <input type="file" name="profilePhoto" id="profilePhoto" onChange={(event) => {
                    setImageSelected(event.target.files[0]);
                }} />
                <button className='bg-orange-500 text-white font-semibold text-lg py-2 rounded-sm' type='submit'>Register</button>
                <div className="text-center">Already have account <Link className='text-blue-500 font-semibold' to={"/login"}>Login</Link></div>
            </form>
        </div>
    )
}
