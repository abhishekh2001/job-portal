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


const App = () => (
    <Formik
        initialValues={{
            email: '',
            password: '',
            name: '',
            confirmPassword: ''
        }}
        validationSchema={validationSchema}
        onSubmit={(values, {setSubmitting}) => {
            setTimeout(() => {
                setSubmitting(false)
                console.log('values', values)
            }, 500)
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
    const handleSubmit = async (values) => {
        try {
            const regBody = {...values, type: 'recruiter'}
            const savedUser = await authService.register(regBody)
            console.log('savedUser', savedUser)
        } catch (err) {  // TODO: Simplify
            console.log('err', err.response.data.error)
            props.setMessage(err.response.data.error)
        }
    }

    return (
        <div>
            <App/>
        </div>
    )
}

export default ApplicantForm

