import useStyles from '../../styles/generalStyles'
import {useAuth} from '../../../context/auth'
import {useEffect, useState} from 'react'
import {
    Box, Button,
    Chip, LinearProgress, Link,
    makeStyles,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import applicantServices from '../../../services/applicantServices'
import {Alert, Rating} from '@material-ui/lab'
import * as yup from 'yup'
import {Field, FieldArray, Form, Formik} from 'formik'
import authService from '../../../services/authService'
import {TextField} from 'formik-material-ui'
import {Autocomplete, AutocompleteRenderInputParams} from 'formik-material-ui-lab'
import {languages} from '../../utils/languages'
import MuiTextField from '@material-ui/core/TextField'

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


const chipStyles = makeStyles((theme) => ({
    chipContainer: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0.5),
        },
    },
}))

const DisplayProfile = ({applicant, setEdit}) => {
    console.log('app', applicant)
    const classes = chipStyles()
    let ratingValue
    if (applicant.ratings.length >= 0)
        ratingValue = applicant.ratings.reduce((sum, curr) => sum = sum + curr.value, 0) / applicant.ratings.length

    return (
        <Paper>
            <Grid container spacing={2} style={{padding: '30px', fontSize: '1.6em'}}>
                <Grid item xs={12}>
                    {applicant.profile && <img src={'data:image/png;base64,'+applicant.profile} />}
                </Grid>
                <Grid item xs={12}>
                    <b>Name:</b> {applicant.user.name}
                </Grid>
                <Grid item xs={12}>
                    <b>EmailId:</b> {applicant.user.email}
                </Grid>
                <Grid item xs={12}>
                    <b>Education:</b> <br />
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Institute Name</TableCell>
                                <TableCell>Start Year</TableCell>
                                <TableCell>End year</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {applicant.education.map(ed => (
                                <TableRow key={ed._id}>
                                    <TableCell>{ed.instituteName}</TableCell>
                                    <TableCell>{ed.startYear}</TableCell>
                                    <TableCell>{ed.endYear}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Grid>
                <Grid item xs={12}>
                    Skills:
                    <Grid className={classes.chipContainer}>
                        {applicant.skills.map((sk, it) => (
                            <Chip key={it} label={sk} />
                        ))}
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    Rating: <Rating disabled precision={0.1} name='rating' value={ratingValue} />
                </Grid>
            </Grid>
        </Paper>
    )
}

const validationSchema = yup.object({
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


const App = ({applicant, setMessage, classes, token}) => {
    console.log('app', applicant)
    const initEducation = []
    for (let ind in applicant.education) {
        const temp = {...applicant.education[ind]}
        initEducation.push({
            key: temp._id,
            instituteName: temp.instituteName,
            startYear: temp.startYear,
            endYear: temp.endYear || ''
        })
    }
    return (
        <Formik
            initialValues={{
                name: applicant.user.name,
                skills: applicant.skills,
                education: initEducation,
                profile: applicant.profile || ''
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, {setSubmitting}) => {
                console.log('hiii')
                try {
                    console.log('values', values)
                    const savedUser = await applicantServices.updateApplicant(values, token)
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
                  errors,
                  setFieldValue
              }) => (
                <Form className={classes.form}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            {<img id='profilePic' src={'data:image/png;base64,'+values.profile} />}
                            <input id="file" name="file" type="file" accept='.jpeg, .png, .jpg' onChange={(event) => {
                                const file = event.currentTarget.files[0]
                                if (file) {
                                    if (file.size < 75000) {
                                        const reader = new FileReader()
                                        reader.onload = (upload) => {
                                            console.log('b64pic: ', upload)
                                            setFieldValue("profile", btoa(upload.target.result))
                                            document.getElementById('profilePic').src = 'data:image/png;base64,' + btoa(upload.target.result)
                                        }
                                        reader.readAsBinaryString(file)
                                    } else {
                                        window.alert('File size is too big')
                                    }
                                }
                            }} />
                        </Grid>
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
                                    <Grid>
                                        {values.education.map((p, index) => {
                                            const instituteName = `education[${index}].instituteName`
                                            const startYear = `education[${index}].startYear`
                                            const endYear = `education[${index}].endYear`

                                            return (
                                                <Grid container spacing={1} key={p.key}>
                                                    <Grid item xs={12}>
                                                        <Field
                                                            component={TextField}
                                                            type="text"
                                                            label="Institute Name"
                                                            name={instituteName}
                                                            autoComplete='off'
                                                            variant="outlined"
                                                            required
                                                            fullWidth
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={5}>
                                                        <Field
                                                            component={TextField}
                                                            type="number"
                                                            label="Start Year"
                                                            name={startYear}
                                                            autoComplete='off'
                                                            variant="outlined"
                                                            required
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={5}>
                                                        <Field
                                                            component={TextField}
                                                            type="number"
                                                            label="End Year"
                                                            name={endYear}
                                                            autoComplete='off'
                                                            variant="outlined"
                                                        />
                                                    </Grid>
                                                    <Grid item xs={2} sm={2}>
                                                        <Button
                                                            type="button"
                                                            color="secondary"
                                                            variant="outlined"
                                                            onClick={() => remove(index)}
                                                        >
                                                            x
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            )
                                        })}
                                        <Grid item xs={5} style={{marginTop: '20px'}}>
                                            <Button
                                                type="button"
                                                variant="outlined"
                                                onClick={() =>
                                                    push({key: Math.random(), instituteName: '', startYear: '', endYear: ''})
                                                }
                                            >
                                                Add Education
                                            </Button>
                                        </Grid>
                                    </Grid>
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
                </Form>
            )}
        </Formik>
    )
}

const ApplicantProfile = () => {
    const classes = useStyles()
    const formClasses = formStyles()
    const {authTokens} = useAuth()
    const [edit, setEdit] = useState(false)
    const [message, setMessage] = useState(null)
    const [currApplicant, setCurrApplicant] = useState(null)

    useEffect(() => {
        (async () => {
            try {
                console.log('inside')
                const response = await applicantServices.getApplicant(authTokens.token)
                setCurrApplicant(response)
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
                    (<Grid container spacing={2}><App applicant={currApplicant}
                         setMessage={setMessage}
                         classes={formClasses}
                         token={authTokens.token}
                    /></Grid>)
                    :
                    currApplicant &&
                    (
                        <div>
                            <DisplayProfile
                                applicant={currApplicant}
                                setEdit={setEdit}
                            />
                            <Button fullWidth variant='contained' onClick={() => setEdit(true)}>Edit</Button>
                        </div>
                    )
            }
        </div>
    )
}

export default ApplicantProfile
