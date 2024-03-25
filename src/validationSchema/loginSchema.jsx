import * as Yup from 'yup'

export const loginSchema = Yup.object({
    email: Yup.string().email().required('please enter your email'),
    password: Yup.string().min(6).max(15).required('please enter your password'),
})
