import React, {useState, useEffect} from 'react'
import Grid from '@material-ui/core/Grid'
import useStyles from '../../styles/generalStyles'
import {
    Button, Dialog, DialogContent, DialogTitle, LinearProgress, MenuItem, Paper,
    TableBody, TableCell, TableRow,
    Typography
} from '@material-ui/core'
import applicantServices from '../../../services/applicantServices'
import {useAuth} from '../../../context/auth'
import CustomTable from '../../CustomTable'
import format from 'date-fns/format'
import {Field, Form, Formik} from 'formik'
import {TextField} from 'formik-material-ui'
import * as yup from 'yup'
import applicationService from '../../../services/applicationService'
import {Alert, Rating} from '@material-ui/lab'

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

const MyApplications = () => {
    const classes = useStyles()
    const {authTokens} = useAuth()
    const [myApplications, setMyApplications] = useState([])
    const [message, setMessage] = useState(null)
    const [openPopup, setOpenPopup] = useState(false)
    const filterFn = {
        fn: (items) => items
    }
    const headers = [
        {id: 'title', name: 'Title', sortable: false},
        {id: 'dateOfJoining', name: 'Joining date', sortable: false},
        {id: 'salaryPerMonth', name: 'Salary', sortable: false},
        {id: 'recruiterName', name: 'Recruiter name', sortable: false},
        {id: 'status', name: 'Status', sortable: false},
        {id: 'rating', name: 'My Rating', sortable: false}
    ]
    const {
        SortableTable,
        recordsAfterSorting
    } = CustomTable(myApplications, headers, filterFn)

    useEffect(() => {
        (async () => {
            try {
                const data = await applicantServices.getApplications(authTokens.token)
                console.log('myAppls', data)
                setMyApplications(data)
            } catch (err) {
                console.log('err', err)
                console.log('err.response', err.response)
            }
        })()
    }, [])


    const setRatings = (appId) => async (values, {setSubmitting}) => {
        try {
            const response = await applicationService.rateJob(appId, values, authTokens.token)
            console.log('response', response)
            setOpenPopup(false)
        } catch (err) {
            setMessage(err.response.data.error)
        }
    }


    return (
        <div>
            <div className={classes.appBarSpacer}/>
            <Typography variant="h3" component="h5">
                My Applications
            </Typography>
            <Grid container spacing={2}>
                <Paper>
                    <SortableTable
                        records={myApplications}
                        headCells={headers}
                        filterFn={filterFn}
                        setData={setMyApplications}
                    >
                        <TableBody>
                            {recordsAfterSorting().map(item => (
                                <TableRow key={item._id}>
                                    <TableCell>{item.job.title}</TableCell>
                                    <TableCell>
                                        {item.dateOfJoining ?
                                            format((new Date(item.dateOfJoining)), 'yyyy-MM-dd\'T\'HH:mm')
                                            :
                                            'Not Applicable'
                                        }
                                    </TableCell>
                                    <TableCell>{item.job.salaryPerMonth}</TableCell>
                                    <TableCell>{item.job.recruiter.user.name}</TableCell>
                                    <TableCell>{item.status}</TableCell>
                                    <TableCell>
                                        {
                                            item.status === 'accepted' ?
                                                item.myRating === -1 ?
                                                    (<div>
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
                                                        <App onSubmit={setRatings(item._id)} />
                                                    </RatePopup>
                                                </div>)
                                                    :
                                                    (<Rating readOnly size='small' value={item.myRating}/>)
                                                :
                                                'Not Applicable'
                                        }
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </SortableTable>
                </Paper>
            </Grid>
        </div>
    )
}

export default MyApplications
