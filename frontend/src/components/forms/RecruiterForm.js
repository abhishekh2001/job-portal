import * as yup from 'yup'
import authService from '../../services/authService'
import {Formik, Form, Field} from 'formik'
import {
    Button,
    LinearProgress,
    Typography,
    makeStyles, Container, CssBaseline, Avatar, Grid, Link,
} from '@material-ui/core'
import {
    TextField,
} from 'formik-material-ui'

import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import {useState} from 'react'
import {Alert} from '@material-ui/lab'
import useStyles from '../styles/formStyles'
import {Redirect} from 'react-router-dom'

const wordCount = (str) => {
    return str.split(/\s+/).length
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
        .string('Enter your password')
        .required('Confirm your password')
        .oneOf([yup.ref('password')], 'Password does not match'),
    name: yup
        .string('Enter your name')
        .required('Name is required'),
    bio: yup
        .string('Enter your bio')
        .test('wordcount',
            'Bio is limited to 250 characters',
            (v, c) => !v || wordCount(v) <= 250),
    contactNumber: yup
        .string('Enter your contact number')
        .required('Contact number is required')
        .test('isnumber',
            'Enter 10 digit phone number',
            (v, c) => /^\d{10}$/.test(v))
})


const App = ({setMessage, classes, setRegistered}) => (
    <Formik
        initialValues={{
            email: '',
            name: '',
            password: '',
            confirmPassword: '',
            bio: '',
            contactNumber: ''
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, {setSubmitting}) => {
            console.log('Submitting')
            try {
                const regBody = {...values, type: 'recruiter'}
                const savedUser = await authService.register(regBody)
                setMessage(null)
                console.log('savedUser', savedUser)
                setSubmitting(false)
                setRegistered(true)
            } catch (err) {
                console.log('err', err.response.data.error)
                setMessage(err.response.data.error)
                setSubmitting(false)
            }
        }}
    >
        {({submitForm, isSubmitting, touched, errors}) => (
            <Form className={classes.form}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Field
                            component={TextField}
                            label="Name"
                            name="name"
                            placeholder="Jon Doe"
                            autoComplete='off'
                            variant="outlined"
                            required
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Field
                            component={TextField}
                            name="email"
                            type="email"
                            label="Email"
                            placeholder="jon.doe@example.com"
                            autoComplete='off'
                            variant="outlined"
                            required
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Field
                            component={TextField}
                            type="password"
                            label="Password"
                            name="password"
                            autoComplete='off'
                            variant="outlined"
                            required
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Field
                            component={TextField}
                            type="password"
                            label="ConfirmPassword"
                            name="confirmPassword"
                            autoComplete='off'
                            variant="outlined"
                            required
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Field
                            component={TextField}
                            type="text"
                            label="Bio"
                            name="bio"
                            autoComplete='off'
                            variant="outlined"
                            multiline
                            required
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Field
                            component={TextField}
                            type="text"
                            label="ContactNumber"
                            name="contactNumber"
                            autoComplete='off'
                            variant="outlined"
                            required
                            fullWidth
                        />
                    </Grid>
                    {isSubmitting && <LinearProgress/>}
                </Grid>

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    type="submit"
                    disabled={isSubmitting}
                    className={classes.submit}
                >
                    Submit
                </Button>
                <Grid container justify="flex-end">
                    <Grid item>
                        <Link href="/login" variant="body2">
                            Already have an account? Sign in
                        </Link>
                        <br/>
                        <Link href="/register" variant="body2">
                            Choose type of user
                        </Link>
                    </Grid>
                </Grid>
            </Form>
        )}
    </Formik>
)


const RecruiterForm = () => {
    const [registered, setRegistered] = useState(false)
    const [message, setMessage] = useState(null)
    const classes = useStyles()

    if (registered) {
        return <Redirect to="/login" />
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>

                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>

                {message && <Alert severity="error">{message}</Alert>}

                <App setMessage={setMessage} classes={classes} setRegistered={setRegistered} />
            </div>
        </Container>
    )
}

export default RecruiterForm

