import * as yup from 'yup'
import authService from '../../services/authService'
import {Formik, Form, Field} from 'formik'
import {
    Button,
    LinearProgress,
    MenuItem,
    FormControl,
    InputLabel,
    FormControlLabel,
    Typography,
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
import {useState} from 'react'
import {Alert} from '@material-ui/lab'

// TODO: Education

const languages = ['C++', 'C', 'Java', 'Python', 'Javascript']

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
})


const App = ({setMessage}) => (
    <Formik
        initialValues={{
            email: '',
            password: '',
            name: '',
            confirmPassword: '',
            skills: []
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, {setSubmitting}) => {
            try {
                const regBody = {...values, type: 'recruiter'}
                // const savedUser = await authService.register(regBody)
                setMessage(null)
                console.log('savedUser', regBody)
            } catch (err) {  // TODO: Simplify
                console.log('err', err)
                // console.log('err', err.response.data.error)
                // setMessage(err.response.data.error)
            }
            setSubmitting(false)
        }}
    >
        {({submitForm, isSubmitting, touched, errors}) => (
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

    return (
        <div>
            {message && <Alert severity="error">{message}</Alert>}

            <App setMessage={setMessage}/>
        </div>
    )
}

export default ApplicantForm

