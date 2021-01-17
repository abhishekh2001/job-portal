import * as yup from 'yup'
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
import {useState} from 'react'
import {Alert} from '@material-ui/lab'
import useStyles from '../styles/formStyles'
import {useAuth} from '../../context/auth'
import {Redirect} from 'react-router-dom'
import jobService from '../../services/jobService'
import {DateTimePicker} from 'formik-material-ui-pickers'
import DateFnsUtils from '@date-io/date-fns'
import {MuiPickersUtilsProvider} from '@material-ui/pickers'

const validationSchema = yup.object({
    maxApplications: yup
        .number('enter number')
        .min(0, 'entry not valid')
        .integer(),
    maxPositions: yup
        .number('enter number')
        .min(0, 'entry not valid')
        .integer()
})


const App = ({classes, onSubmit, job}) => (
    <Formik
        initialValues={{
            maxApplications: job.maxApplications,
            maxPositions: job.maxPositions,
            deadline: job.deadline
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
    >
        {({submitForm, isSubmitting, touched, errors}) => (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Form className={classes.modalForm}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Field
                                component={TextField}
                                name="maxApplications"
                                type="number"
                                label="Max number of applicants"
                                autoComplete='off'
                                variant="outlined"
                                required
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                component={TextField}
                                type="number"
                                label="Max number of positions"
                                name="maxPositions"
                                variant="outlined"
                                required
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                component={DateTimePicker}
                                label="Deadline"
                                name="deadline"
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
            </MuiPickersUtilsProvider>
        )}
    </Formik>
)


const JobEditForm = ({job, handleOnUpdate, jobs, setOpenPopup}) => {
    const [message, setMessage] = useState(null)
    const [error, setError] = useState(true)
    const classes = useStyles()

    const {authTokens} = useAuth()


    const updateJob = async (values, {setSubmitting}) => {
        console.log('Submitting')
        try {
            const body = {...values}
            const result = await jobService.updateOne(job._id, body, authTokens.token)
            setMessage(null)
            console.log('result', result)

            setError(false)
            setMessage('Updated')
            await new Promise((resolve)=>setTimeout(() => {
                resolve();
            }, 1000))

            setSubmitting(false)
            handleOnUpdate()
            setOpenPopup(false)
        } catch (err) {
            console.log('err', err.response.data.error)
            setMessage(err.response.data.error)
            setSubmitting(false)
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <Grid>
                {message &&
                    <Alert
                        style={{marginBottom: '15px'}}
                        severity={error ? "error" : "success"}
                    >{message}</Alert>}
                <App job={job} classes={classes} onSubmit={updateJob}/>
            </Grid>
        </Container>
    )
}

export default JobEditForm
