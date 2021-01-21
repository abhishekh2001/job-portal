import React, {useEffect, useState} from 'react'
import recruiterService from '../../../services/recruiterService'
import {useAuth} from '../../../context/auth'
import CustomTable from '../../CustomTable'
import {Alert, Rating} from '@material-ui/lab'
import Grid from '@material-ui/core/Grid'
import {
    Button,
    Dialog,
    DialogContent, LinearProgress,
    MenuItem,
    Paper,
    TableBody,
    TableCell,
    TableRow,
    Typography
} from '@material-ui/core'
import format from 'date-fns/format'
import useStyles from '../../styles/generalStyles'
import applicationService from '../../../services/applicationService'
import * as yup from 'yup'
import {Field, Form, Formik} from 'formik'
import {TextField} from 'formik-material-ui'

const validationSchema = yup.object({
    value: yup
        .number('enter rating')
        .required()
        .integer('Should be an integer')
})

const RatePopup = (props) => {
    const {title, children, openPopup, setOpenPopup} = props

    return (
        <Dialog open={openPopup} onClose={() => setOpenPopup(false)}>
            <DialogContent dividers>
                {children}
            </DialogContent>
        </Dialog>
    )
}


const App = ({onSubmit}) => (
    <Formik
        initialValues={{
            value: 0
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
    >
        {({submitForm, isSubmitting, touched, errors}) => (
            <Form>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Field
                            component={TextField}
                            type="number"
                            label="Rating"
                            name="value"
                            select
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                        >
                            {[0, 1, 2, 3, 4, 5].map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Field>
                    </Grid>
                    {isSubmitting && <LinearProgress/>}
                </Grid>

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    type="submit"
                    disabled={isSubmitting}
                >
                    Submit
                </Button>
            </Form>
        )}
    </Formik>
)

const CustomRow = ({item, token}) => {
    const [openPopup, setOpenPopup] = useState(false)
    const [message, setMessage] = useState(null)

    const setRatings = (appId) => async (values, {setSubmitting}) => {
        try {
            const response = await recruiterService.rateApplicant(appId, values, token)
            console.log('response', response)
            setOpenPopup(false)
            window.location.reload()
        } catch (err) {
            setMessage(err.response.data.error)
        }
    }

    return (
        <TableRow key={item._id}>
            <TableCell>{item.appName}</TableCell>
            <TableCell>
                {format((new Date(item.dateOfJoining)), 'yyyy-MM-dd\'T\'HH:mm')}
            </TableCell>
            <TableCell>{item.job.typeOfJob}</TableCell>
            <TableCell>{item.jobTitle}</TableCell>
            <TableCell>
                <Rating
                    name="read-only"
                    precision={0.5}
                    size='small'
                    value={item.applicantRating}
                    readOnly/>
            </TableCell>
            <TableCell>
                <div>
                    <Button variant='outlined'
                            onClick={() => setOpenPopup(true)}
                    >
                        Rate
                    </Button>
                    <RatePopup
                        openPopup={openPopup}
                        setOpenPopup={setOpenPopup}
                    >
                        {message && <Alert severity='error'>{message}</Alert>}
                        <App onSubmit={setRatings(item.applicant._id)}/>
                    </RatePopup>
                </div>
            </TableCell>
        </TableRow>
    )
}

const AcceptedEmployees = () => {
    const classes = useStyles()
    const {authTokens} = useAuth()
    const [message, setMessage] = useState(null)
    const [acceptedApplications, setAcceptedApplications] = useState([])
    const [filterFn, setFilterFn] = useState({fn: items => items})
    const headers = [
        {id: 'appName', name: 'Name', sortable: true},
        {id: 'dateOfJoining', name: 'Date of Joining', sortable: true},
        {id: 'type', name: 'Type', sortable: false},
        {id: 'jobTitle', name: 'Job Title', sortable: true},
        {id: 'applicantRating', name: 'Rating', sortable: true},
        {id: 'rating', name: 'Rate', sortable: false}
    ]
    const {
        SortableTable,
        recordsAfterSorting
    } = CustomTable(acceptedApplications, headers, filterFn)

    useEffect(() => {
        (async () => {
            try {
                const response = await recruiterService.getAcceptedApplications(authTokens.token)
                console.log('immediate >', response)
                for (let ind in response) {
                    let applicantRating = 0
                    if (response[ind].applicant.ratings.length > 0) {
                        console.log('rating in ', response[ind])
                        applicantRating = response[ind].applicant.ratings
                            .reduce((cum, cur) => cum + cur.value, 0) / response[ind].applicant.ratings.length
                    }
                    response[ind].appName = response[ind].applicant.user.name
                    response[ind].applicantRating = applicantRating
                    response[ind].jobTitle = response[ind].job.title
                }
                console.log('modified response >', response)
                setAcceptedApplications(response)
            } catch (err) {
                console.log('err', err.response)
                if (err.response.data.error)
                    setMessage({
                        severity: 'error',
                        content: err.response.data.error
                    })
            }
        })()
    }, [])

    const setRatings = (appId) => async (values, {setSubmitting}) => {
        try {
            const response = await applicationService.rateJob(appId, values, authTokens.token)
            console.log('response', response)
            // setOpenPopup(false)
            window.location.reload()
        } catch (err) {
            setMessage(err.response.data.error)
        }
    }

    return (
        <div>
            <div className={classes.appBarSpacer}/>
            {message && <Alert severity={message.severity}>{message.content}</Alert>}
            <Grid container style={{marginBottom: '40px'}}>
                <Grid item xs={12}>
                    <Typography variant="h3" component='h5'>
                        View accepted applications
                    </Typography>
                </Grid>
            </Grid>
            <Grid>
                <Paper>
                    <SortableTable
                        records={acceptedApplications}
                        headCells={headers}
                        filterFn={filterFn}
                        setData={setAcceptedApplications}
                    >
                        <TableBody>
                            {recordsAfterSorting().map(item => (
                                <CustomRow
                                    item={item}
                                    token={authTokens.token}
                                    key={item._id}
                                />
                            ))}
                        </TableBody>
                    </SortableTable>
                </Paper>
            </Grid>
        </div>
    )
}

export default AcceptedEmployees
