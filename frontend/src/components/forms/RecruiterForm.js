import { useFormik } from 'formik';
import * as yup from 'yup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const wordCount = (str) => {
    return str.split(' ')
        .filter(function(n) { return n != '' })
        .length;
}

const validationSchema = yup.object({
    email: yup
        .string('Enter your email')
        .email('Enter a valid email')
        .required('Email is required'),
    password: yup
        .string('Enter your password')
        .min(8, 'Password should be of minimum 8 characters length')
        .required('Password is required'),
    confirmPassword: yup
        .string("Enter your password")
        .required("Confirm your password")
        .oneOf([yup.ref("password")], "Password does not match"),
    name: yup
        .string("Enter your name")
        .required('Name is required'),
    bio: yup
        .string("Enter your bio")
        .test('wordcount',
            'Bio is limited to 250 characters',
            (v, c) => !v || wordCount(v) <= 250),
    contactNumber: yup
        .string("Enter your contact number")
        .required("Contact number is required")
})

const RecruiterForm = () => {
    const formik = useFormik({
        initialValues: {
            email: 'jon.doe@example.com',
            name: 'Jon Doe',
            password: '',
            confirmPassword: '',
            bio: '',
            contactNumber: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            const regBody = JSON.stringify(values, null, 2)
            console.log('form res', regBody)
        },
    })

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth
                    id="name"
                    name="name"
                    label="Name"
                    type="text"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                />
                <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />
                <TextField
                    fullWidth
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                />
                <TextField
                    fullWidth
                    id="confirmPassword"
                    name="confirmPassword"
                    label="ConfirmPassword"
                    type="password"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                />
                <TextField
                    fullWidth
                    id="bio"
                    name="bio"
                    label="Bio"
                    type="text"
                    value={formik.values.bio}
                    onChange={formik.handleChange}
                    error={formik.touched.bio && Boolean(formik.errors.bio)}
                    helperText={formik.touched.bio && formik.errors.bio}
                />
                <TextField
                    fullWidth
                    id="contactNumber"
                    name="contactNumber"
                    label="ContactNumber"
                    type="text"
                    value={formik.values.contactNumber}
                    onChange={formik.handleChange}
                    error={formik.touched.contactNumber && Boolean(formik.errors.contactNumber)}
                    helperText={formik.touched.contactNumber && formik.errors.contactNumber}
                />
                <Button color="primary" variant="contained" fullWidth type="submit">
                    Submit
                </Button>
            </form>
        </div>
    )
}

export default RecruiterForm
