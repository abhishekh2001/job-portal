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

const validationSchema = yup.object({
    email: yup
        .string('Enter your email')
        .email('Enter a valid email')
        .required('Email is required'),
    password: yup
        .string('Enter your password')
        .required('Password is required')
})


const App = ({setMessage, classes}) => (
    <Formik
        initialValues={{
            email: '',
            password: ''
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, {setSubmitting}) => {
            console.log('Submitting')
            try {
                const regBody = {...values}
                const response = await authService.login(regBody)
                setMessage(null)
                console.log('savedUser', response)
                localStorage.setItem('access_token', response.token)
            } catch (err) {
                console.log('err', err.response.data.error)
                setMessage(err.response.data.error)
            }
            setSubmitting(false)
        }}
    >
        {({submitForm, isSubmitting, touched, errors}) => (
            <Form className={classes.form}>
                <Grid container spacing={2}>
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
                        <Link href="/register" variant="body2">
                            Don't have an account? Sign up!
                        </Link>
                    </Grid>
                </Grid>
            </Form>
        )}
    </Formik>
)


const LoginForm = () => {
    const [message, setMessage] = useState(null)
    const classes = useStyles()

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>

                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>

                {message && <Alert severity="error">{message}</Alert>}
                <App setMessage={setMessage} classes={classes}/>
            </div>
        </Container>
    )
}

export default LoginForm

