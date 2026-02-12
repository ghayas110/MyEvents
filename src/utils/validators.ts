import * as yup from 'yup'

export const loginSchema = yup.object({
    email: yup.string().required('Email is required').email('Invalid email format'),
    password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
})

export const registerSchema = yup.object({
    email: yup.string().required('Email is required').email('Invalid email format'),
    password: yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Must contain one uppercase letter')
        .matches(/[a-z]/, 'Must contain one lowercase letter')
        .matches(/[0-9]/, 'Must contain one number')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Must contain one special character'),
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
})

export const eventSchema = yup.object({
    title: yup.string().required('Title is required').min(5, 'Min 5 characters').max(100, 'Max 100 characters'),
    category: yup.string().required('Category is required'),
    description: yup.string().required('Description is required').min(20, 'Min 20 characters'),
    date: yup.string().required('Date is required').test('is-future', 'Date must be in the future', (value) => {
        return new Date(value) > new Date()
    }),
    location: yup.string().required('Location is required'),
    city: yup.string().required('City is required').min(2, 'Min 2 characters'),
    lat: yup.number().min(-90).max(90).optional(),
    lng: yup.number().min(-180).max(180).optional(),
    attendeeLimit: yup.number().positive('Must be a positive integer').integer().optional(),
})
