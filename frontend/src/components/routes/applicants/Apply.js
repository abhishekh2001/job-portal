import * as yup from 'yup'
import {Formik, Form, Field} from 'formik'
import {
    Button,
    LinearProgress,
    Grid,
} from '@material-ui/core'
import {
    TextField,
} from 'formik-material-ui'

import React, {useEffect, useState} from 'react'
import {Alert} from '@material-ui/lab'
import useStyles from '../../styles/generalStyles'
import applicationService from '../../../services/applicationService'
import {useAuth} from '../../../context/auth'
import { withRouter } from 'react-router-dom';

const wordCount = (str) => {
    return str.split(/\s+/).length
}

const validationSchema = yup.object({
    sop: yup
        .string('Enter sop')
        .required('sop is required')
        .test('wordcount',
            'Bio is limited to 250 characters',
            (v, c) => !v || wordCount(v) <= 250),
})


const App = ({classes, onSubmit}) => (
    <Formik
        initialValues={{
            sop: '',
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
    >
        {({submitForm, isSubmitting, touched, errors}) => (
            <Form className={classes.form}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Field
                            component={TextField}
                            aria-label="minimum height"
                            multiline
                            name="sop"
                            type="text"
                            label="SOP"
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

const ApplyToJob = (props) => {
    const { authTokens } = useAuth()
    const [message, setMessage] = useState(null)
    const classes = useStyles()

    useEffect(() => {
        console.log('props match', props.match.params.jobId)
    }, [])

    const postApplication = async (values, {setSubmitting}) => {
        try {
            const savedApp = await applicationService.applyToJob(props.match.params.jobId, values, authTokens.token)
            console.log('save as', savedApp)
            props.history.push('/browseJobs')
        } catch (err) {
            setMessage({error: true, content: err.response.data.error})
            setSubmitting(false)
        }
    }

    return (
        <div>
            <div className={classes.appBarSpacer}/>
            {message && <Alert severity={message.error ? 'error' : 'success'}>{message.content}</Alert>}
            <App classes={classes} onSubmit={postApplication} />
        </div>
    )
}

export default withRouter(ApplyToJob)
