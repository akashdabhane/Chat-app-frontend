import * as Yup from 'yup'

export const registrationSchema = Yup.object({
    name: Yup.string().required("please enter your name").min(2),
    email: Yup.string().email().required("please enter your email"), 
    password: Yup.string().min(6).max(15).required("password is required"), 
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
})
