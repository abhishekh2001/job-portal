import * as yup from 'yup'
import authService from '../../services/authService'
import {Formik, Form, Field, FieldArray, getIn} from 'formik'
import {
    Button,
    LinearProgress,
    MenuItem,
    FormControl,
    InputLabel,
    FormControlLabel,
    Typography, Divider,
} from '@material-ui/core'
import MuiTextField from '@material-ui/core/TextField'
import {
    fieldToTextField,
    TextField,
    TextFieldProps,
    Select,
    Switch,
} from 'formik-material-ui'
import {MuiPickersUtilsProvider} from '@material-ui/pickers'
import {
    Autocomplete,
    ToggleButtonGroup,
    AutocompleteRenderInputParams,
} from 'formik-material-ui-lab'
import Box from '@material-ui/core/Box'
import ToggleButton from '@material-ui/lab/ToggleButton'
import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft'
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter'
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight'
import FormatAlignJustifyIcon from '@material-ui/icons/FormatAlignJustify'
import {spacing} from '@material-ui/system'
import React, {useState} from 'react'
import {Alert} from '@material-ui/lab'
import EducationForm from './EducationForm'
import * as Yup from 'yup'
import {makeStyles} from '@material-ui/core/styles'

// TODO: Education

const languages = ['C++', 'C', 'Java', 'Python', 'Javascript']

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    button: {
        margin: theme.spacing(1)
    },
    field: {
        margin: theme.spacing(1)
    }
}))

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
    education: Yup.array().of(
        Yup.object().shape({
            instituteName: Yup
                .string()
                .required('Institute name is required'),
            startYear: Yup
                .number('Must be a number')
                .required('Start year is required')
                .min(1800, 'Invalid year')
                .max(2040, 'Range not supported'),
            endYear: Yup
                .number()
                .min(Yup.ref("startYear"), 'End year must be after start')
                .max(2040, 'Range not supported')
        })
    )
})


const App = ({setMessage, classes}) => (
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
            } catch (err) {  // TODO: Simplify
                console.log('err', err)
                setMessage(err.response.data.error)
            }
            setSubmitting(false)
        }}
    >
        {({values,
              handleChange,
              handleBlur,
              submitForm,
              isSubmitting,
              touched,
              errors
        }) => (
            <Form>
                <Box>
                    <Field
                        component={TextField}
                        label="Name"
                        name="name"
                        placeholder="Jon Doe"
                        autoComplete='off'
                    />
                </Box>
                <Box>
                    <Field
                        component={TextField}
                        name="email"
                        type="email"
                        label="Email"
                        placeholder="jon.doe@example.com"
                        autoComplete='off'
                    />
                </Box>
                <Box>
                    <Field
                        component={TextField}
                        type="password"
                        label="Password"
                        name="password"
                        autoComplete='off'
                    />
                </Box>
                <Box>
                    <Field
                        component={TextField}
                        type="password"
                        label="ConfirmPassword"
                        name="confirmPassword"
                        autoComplete='off'
                    />
                </Box>
                <Box marginTop={2} marginBottom={2}>
                    <Field
                        name="skills"
                        multiple
                        freeSolo
                        component={Autocomplete}
                        options={languages}
                        style={{width: 200}}
                        renderInput={(params: AutocompleteRenderInputParams) => (
                            <MuiTextField
                                {...params}
                                error={touched['skills'] && !!errors['skills']}
                                helperText={touched['skills'] && errors['skills']}
                                label="Skills"
                                variant="outlined"
                            />
                        )}
                    />
                </Box>
                <Box>

                    <FieldArray name="education">
                        {({push, remove}) => (
                            <div>
                                {values.education.map((p, index) => {
                                    const instituteName = `education[${index}].instituteName`
                                    const touchedName = getIn(touched, instituteName)
                                    const errorName = getIn(errors, instituteName)

                                    const startYear = `education[${index}].startYear`
                                    const touchedStartYear = getIn(touched, startYear)
                                    const errorStartYear = getIn(errors, startYear)

                                    const endYear = `education[${index}].endYear`
                                    const touchedEndYear = getIn(touched, endYear)
                                    const errorEndYear = getIn(errors, endYear)

                                    return (
                                        <div key={p.key}>
                                            <Field
                                                component={TextField}
                                                type="text"
                                                label="Institute Name"
                                                name={instituteName}
                                                autoComplete='off'
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
                                                className={classes.button}
                                                margin="normal"
                                                type="button"
                                                color="secondary"
                                                variant="outlined"
                                                onClick={() => remove(index)}
                                            >
                                                x
                                            </Button>
                                        </div>
                                    )
                                })}
                                <Button
                                    className={classes.button}
                                    type="button"
                                    variant="outlined"
                                    onClick={() =>
                                        push({key: Math.random(), instituteName: '', startYear: '', endYear: ''})
                                    }
                                >
                                    Add
                                </Button>
                            </div>
                        )}
                    </FieldArray>
                    <Divider style={{marginTop: 20, marginBottom: 20}}/>

                </Box>



                {isSubmitting && <LinearProgress/>}
                <Box>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        onClick={submitForm}
                    >
                        Submit
                    </Button>
                </Box>
            </Form>

        )}
    </Formik>
)


const ApplicantForm = (props) => {
    const [message, setMessage] = useState(null)
    const classes = useStyles()

    return (
        <div>
            {message && <Alert severity="error">{message}</Alert>}

            <App setMessage={setMessage} classes={classes}/>
        </div>
    )
}

export default ApplicantForm

