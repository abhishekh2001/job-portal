import * as yup from 'yup'
import authService from '../../services/authService'
import {Formik, Form, Field, FieldArray, getIn} from 'formik'
import {
    Button,
    LinearProgress,
    Typography,
    makeStyles, Container, CssBaseline, Avatar, Grid, Link,
} from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import MuiTextField from '@material-ui/core/TextField';

import {
    TextField,
} from 'formik-material-ui'

import {
    Autocomplete,
    AutocompleteRenderInputParams,
} from 'formik-material-ui-lab'
import {Alert} from '@material-ui/lab'
import {useState} from 'react'
import useStyles from '../styles/formStyles'
import {Redirect} from 'react-router-dom'

const languages = ['C++', 'C', 'Java', 'Python', 'Javascript']  // TODO: export

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
    education: yup.array().of(
        yup.object().shape({
            instituteName: yup
                .string()
                .required('Institute name is required'),
            startYear: yup
                .number('Must be a number')
                .required('Start year is required')
                .min(1800, 'Invalid year')
                .max(2040, 'Range not supported'),
            endYear: yup
                .number()
                .min(yup.ref('startYear'), 'End year must be after start')
                .max(2040, 'Range not supported')
        })
    )
})


const App = ({setMessage, classes, setRegistered}) => (
    <Formik
        initialValues={{
            email: '',
            password: '',
            name: '',
            confirmPassword: '',
            skills: [],
            education: [
                {
                    key: Math.random(),
                    instituteName: '',
                    startYear: '',
                    endYear: ''
                }
            ]
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, {setSubmitting}) => {
            try {
                const regBody = {...values, type: 'applicant'}
                const savedUser = await authService.register(regBody)
                setMessage(null)
                console.log('savedUser', savedUser)
                setSubmitting(false)
                setRegistered(true)
            } catch (err) {
                console.log('err', err)
                setMessage(err.response.data.error)
                setSubmitting(false)
            }
        }}
    >
        {({
              values,
              isSubmitting,
              touched,
              errors
          }) => (
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
                            name="skills"
                            multiple
                            freeSolo
                            component={Autocomplete}
                            options={languages}
                            variant="outlined"
                            fullWidth
                            renderInput={(params: AutocompleteRenderInputParams) => (
                                <MuiTextField
                                    {...params}
                                    error={touched['skills'] && !!errors['skills']}
                                    helperText={touched['skills'] && errors['skills']}
                                    label="Skills"
                                    variant="outlined"
                                    fullWidth
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography component="h1" variant="h5">
                            Education
                        </Typography>
                        <FieldArray name="education">
                            {({push, remove}) => (
                                <div>
                                    {values.education.map((p, index) => {
                                        const instituteName = `education[${index}].instituteName`
                                        const startYear = `education[${index}].startYear`
                                        const endYear = `education[${index}].endYear`

                                        return (
                                            <div key={p.key}>
                                                <Field
                                                    component={TextField}
                                                    type="text"
                                                    label="Institute Name"
                                                    name={instituteName}
                                                    autoComplete='off'
                                                    variant="outlined"
                                                    fullWidth
                                                />
                                                <Field
                                                    component={TextField}
                                                    type="number"
                                                    label="Start Year"
                                                    name={startYear}
                                                    autoComplete='off'
                                                />
                                                <Field
                                                    component={TextField}
                                                    type="number"
                                                    label="End Year"
                                                    name={endYear}
                                                    autoComplete='off'
                                                />

                                                <Button
                                                    type="button"
                                                    color="secondary"
                                                    variant="outlined"
                                                    style={{marginTop: '5px'}}
                                                    onClick={() => remove(index)}
                                                >
                                                    x
                                                </Button>
                                            </div>
                                        )
                                    })}
                                    <Button
                                        type="button"
                                        variant="outlined"
                                        onClick={() =>
                                            push({key: Math.random(), instituteName: '', startYear: '', endYear: ''})
                                        }
                                        style={{marginTop: '15px'}}
                                    >
                                        Add Education
                                    </Button>
                                </div>
                            )}
                        </FieldArray>
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

const ApplicantForm = () => {
    const [message, setMessage] = useState(null)
    const [registered, setRegistered] = useState(false)
    const classes = useStyles()

    if (registered) {
        return <Redirect to="/login" />
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h4">
                    Sign up
                </Typography>

                {message && <Alert severity="error">{message}</Alert>}
                <App setMessage={setMessage} classes={classes} setRegistered={setRegistered} />
            </div>
        </Container>
    )
}

export default ApplicantForm

