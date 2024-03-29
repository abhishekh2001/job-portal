import * as yup from 'yup'
import authService from '../../services/authService'
import {MuiPickersUtilsProvider} from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import {Formik, Form, Field} from 'formik'
import {
    Button,
    LinearProgress,
    Typography,
    makeStyles,
    Container,
    CssBaseline,
    Avatar,
    Grid,
    Link,
    MenuItem,
} from '@material-ui/core'
import {
    TextField
} from 'formik-material-ui'
import {
    DateTimePicker
} from 'formik-material-ui-pickers'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import {useState} from 'react'
import {Alert} from '@material-ui/lab'
import useStyles from '../styles/formStyles'
import {
    Autocomplete,
    AutocompleteRenderInputParams
} from 'formik-material-ui-lab'
import MuiTextField from '@material-ui/core/TextField'
import {languages} from '../utils/languages'
import {typeOfJobsArray} from '../utils/typeOfJob'
import {durationArray} from '../utils/duration'
import jobService from '../../services/jobService'
import {useAuth} from '../../context/auth'
import {Redirect} from 'react-router-dom'

const validationSchema = yup.object({
    title: yup
        .string('Enter the title')
        .required('Title is required'),
    maxApplications: yup
        .number('Enter max Applications')
        .integer('Enter a valid integer')
        .min(0, 'Enter a valid number')
        .required('Max number of applicants is required'),
    maxPositions: yup
        .number('Enter max positions')
        .integer('Enter a valid integer')
        .min(0, 'Enter a valid number')
        .required('Max positions available is required'),
    deadline: yup
        .date('Enter the deadline')
        .min(new Date(), 'Select a deadline after now')  // TODO: Check
        .required('Deadline is required'),
    typeOfJob: yup
        .string('Select type of job')
        .oneOf(typeOfJobsArray, 'Selection is not valid')
        .required('Select type of job'),
    duration: yup
        .number('Choose duration')
        .integer('Enter a valid integer')
        .min(0, 'Select valid duration')
        .max(6, 'Maximum duration is 6 months or zero (indefinite)'),
    salaryPerMonth: yup
        .number('Choose a salary')
        .integer('Enter an integer')
        .min(0)
})


const App = ({onSubmit, classes}) => (
    <Formik
        initialValues={{
            title: '',
            maxApplications: '',
            maxPositions: '',
            deadline: new Date(),
            skillSetsRequired: [],
            typeOfJob: 'Full-time',
            duration: '0',
            salaryPerMonth: ''
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
    >
        {({submitForm, isSubmitting, touched, errors}) => (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Form className={classes.form}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Field
                                component={TextField}
                                label="Title"
                                name="title"
                                placeholder="Job Title"
                                autoComplete='off'
                                variant="outlined"
                                required
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                component={TextField}
                                name="maxApplications"
                                type="number"
                                label="Max Applicants"
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
                                label="Max Positions"
                                name="maxPositions"
                                autoComplete='off'
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
                        <Grid item xs={12}>
                            <Field
                                name="skillSetsRequired"
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
                            <Field
                                component={TextField}
                                type="text"
                                label="Type of Job"
                                name="typeOfJob"
                                select
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            >
                                {typeOfJobsArray.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Field>
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                component={TextField}
                                type="Number"
                                label="Duration"
                                name="duration"
                                helperText="Between 0 and 6"
                                select
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                            >
                                {durationArray.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option === 0 ? '(inf) ' + option : option}
                                    </MenuItem>
                                ))}
                            </Field>

                            <Grid item xs={12}>
                                <Field
                                    component={TextField}
                                    type="number"
                                    label="Salary"
                                    name="salaryPerMonth"
                                    autoComplete='off'
                                    variant="outlined"
                                    required
                                    fullWidth
                                />
                            </Grid>
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


const JobPostForm = () => {
    const [message, setMessage] = useState(null)
    const [created, setCreated] = useState(false)
    const classes = useStyles()

    const { authTokens } = useAuth()

    const postJob = async (values, {setSubmitting}) => {
        console.log('Submitting')
        try {
            const jobPostBody = {...values, dateOfPosting: new Date()}
            console.log('jobPostBody', jobPostBody)
            const response = await jobService.postOne(jobPostBody, authTokens.token)
            console.log('response', response)
            setMessage(null)
            setSubmitting(false)
            setCreated(true)
        } catch (err) {
            console.log('err', err.response.data.error)
            setMessage(err.response.data.error)
            setSubmitting(false)
        }
    }

    if (created) {
        return <Redirect to="/jobListDashboard" />
    }

    return (
        <Container component="main" maxWidth="sm">
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Create a job
                </Typography>

                {message && <Alert severity="error">{message}</Alert>}
                <App onSubmit={postJob} classes={classes}/>
            </div>
        </Container>
    )
}

export default JobPostForm
