import useStyles from '../../styles/generalStyles'
import {useAuth} from '../../../context/auth'
import {useEffect, useState} from 'react'
import {
    Button,
    LinearProgress,
    makeStyles,
    Paper,
} from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import {Alert} from '@material-ui/lab'
import * as yup from 'yup'
import {Field, Form, Formik} from 'formik'
import {TextField} from 'formik-material-ui'
import recruiterService from '../../../services/recruiterService'

const formStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        marginBottom: theme.spacing(6),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    modalForm: {
        width: '100%',
        marginTop: theme.spacing(0)
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}))

const DisplayProfile = ({applicant}) => {

    return (
        <Paper>
            <Grid container spacing={2} style={{padding: '30px', fontSize: '1.6em'}}>
                <Grid item xs={12}>
                    <b>Name:</b> {applicant.user.name}
                </Grid>
                <Grid item xs={12}>
                    <b>EmailId:</b> {applicant.user.email}
                </Grid>
                <Grid item xs={12}>
                    <b>Bio</b><br />
                    <Grid xs={12} style={{backgroundColor: '#746D69', color: 'white', padding: '30px', whiteSpace: 'pre-wrap'}}>
                        {applicant.bio}
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <b>Contact: </b> {applicant.contactNumber}
                </Grid>
            </Grid>
        </Paper>
    )
}

const validationSchema = yup.object({
    name: yup
        .string('Enter your name')
        .required('Name is required'),
    bio: yup
        .string('enter bio')
        .required('bio required'),
    contactNumber: yup
        .string('enter number')
        .required('contact is required')
})


const App = ({applicant, setMessage, classes, token}) => {
    return (
        <Formik
            initialValues={{
                name: applicant.user.name,
                bio: applicant.bio,
                contactNumber: applicant.contactNumber
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, {setSubmitting}) => {
                try {
                    console.log('values', values, token)
                    const savedUser = await recruiterService.updateRecruiter(values, token)
                    setMessage(null)
                    console.log('savedUser', savedUser)
                    setSubmitting(false)
                    window.location.reload()
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
                </Form>
            )}
        </Formik>
    )
}

const RecruiterProfile = () => {
    const classes = useStyles()
    const formClasses = formStyles()
    const {authTokens} = useAuth()
    const [edit, setEdit] = useState(false)
    const [message, setMessage] = useState(null)
    const [currRecruiter, setCurrRecruiter] = useState(null)

    useEffect(() => {
        (async () => {
            try {
                console.log('inside')
                const response = await recruiterService.getRecruiter(authTokens.token)
                console.log('im response', response)
                setCurrRecruiter(response)
            } catch (err) {
                console.log('err', err.response)
                if (err.response && err.response.data && err.response.data.error)
                    setMessage(err.response.data.error)
                else
                    setMessage('Something went wrong')
            }
        })()
    }, [])

    return (
        <div>
            <div className={classes.appBarSpacer} />
            {message && <Alert severity='error'>{message}</Alert> }
            {
                edit ?
                    (<Grid container spacing={2}><App applicant={currRecruiter}
                                                      setMessage={setMessage}
                                                      classes={formClasses}
                                                      token={authTokens.token}
                    /></Grid>)
                    :
                    currRecruiter &&
                    (
                        <div>
                            <DisplayProfile
                                applicant={currRecruiter}
                                setEdit={setEdit}
                            />
                            <Button fullWidth variant='contained' onClick={() => setEdit(true)}>Edit</Button>
                        </div>
                    )
            }
        </div>
    )
}

export default RecruiterProfile
