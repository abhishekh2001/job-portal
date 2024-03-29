// Joblistings for the applicants
import React, {useState, useEffect} from 'react'
import jobService from '../../../services/jobService'
import Grid from '@material-ui/core/Grid'
import useStyles from '../../styles/generalStyles'
import {
    Button, ButtonGroup,
    LinearProgress, MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from '@material-ui/core'
import Toolbar from '@material-ui/core/Toolbar'
import CustomTable from '../../CustomTable'
import {Field, Form, Formik} from 'formik'
import {MuiPickersUtilsProvider} from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import {TextField} from 'formik-material-ui'
import {DateTimePicker} from 'formik-material-ui-pickers'
import {typeOfJobsArray} from '../../utils/typeOfJob'
import {durationArray} from '../../utils/duration'
import authService from '../../../services/authService'
import applicantServices from '../../../services/applicantServices'
import {lightGreen} from '@material-ui/core/colors'
import {useAuth} from '../../../context/auth'
import {Link} from 'react-router-dom'
import format from 'date-fns/format'
import Fuse from 'fuse.js'
import {Rating} from '@material-ui/lab'

const FilterForm = ({classes, filter, setFilter, setFilterFn}) => {
    return (
        <Formik
            initialValues={{
                title: filter.title,
                typeOfJob: filter.typeOfJob,
                minSalary: filter.minSalary,
                maxSalary: filter.maxSalary,
                duration: filter.duration
            }}
            onSubmit={(values, {setSubmitting}) => {
                setFilterFn({
                    fn: (items) => {
                        let returnArr = items
                        if (values.title !== '') {
                            const fuse = new Fuse(returnArr, {
                                keys: ['title']
                            })
                            console.log('search', fuse.search(values.title))
                            returnArr = fuse.search(values.title).map(res => res.item)
                        }
                        if (values.typeOfJob !== '')
                            returnArr = returnArr.filter(item => item.typeOfJob === values.typeOfJob)
                        if (values.minSalary !== '')
                            returnArr = returnArr.filter(item => item.salaryPerMonth >= values.minSalary)
                        if (values.maxSalary !== '')
                            returnArr = returnArr.filter(item => item.salaryPerMonth < values.maxSalary)
                        if (values.duration !== '')
                            returnArr = returnArr.filter(item => item.duration < values.duration)
                        return returnArr
                    }
                })

                setSubmitting(false)
            }}
        >
            {({submitForm, isSubmitting, touched, errors}) => (
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Form className={classes.form}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Field
                                    component={TextField}
                                    type="text"
                                    label="Title"
                                    name="title"
                                    autoComplete='off'
                                    variant="outlined"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Field
                                    component={TextField}
                                    type="text"
                                    label="Type of Job"
                                    name="typeOfJob"
                                    select
                                    variant="outlined"
                                    margin="normal"
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
                            <Grid item xs={6}>
                                <Field
                                    component={TextField}
                                    type="text"
                                    label="Duration"
                                    name="duration"
                                    select
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                >
                                    {durationArray.map((option) => (
                                        <MenuItem key={option + 1} value={option + 1}>
                                            {option + 1}
                                        </MenuItem>
                                    ))}
                                </Field>
                            </Grid>
                            <Grid item xs={6}>
                                <Field
                                    component={TextField}
                                    type="number"
                                    label="Min Salary"
                                    name='minSalary'
                                    autoComplete='off'
                                    variant="outlined"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Field
                                    component={TextField}
                                    type="number"
                                    label="Max salary"
                                    name="maxSalary"
                                    autoComplete='off'
                                    variant="outlined"
                                    fullWidth
                                />
                            </Grid>
                            {isSubmitting && <LinearProgress/>}
                        </Grid>

                        <ButtonGroup fullWidth style={{marginTop: '30px'}}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                type="submit"
                                disabled={isSubmitting}
                                className={classes.submit}
                            >
                                Filter
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                fullWidth
                                type='reset'
                                disabled={isSubmitting}
                            >
                                Reset
                            </Button>
                        </ButtonGroup>
                    </Form>
                </MuiPickersUtilsProvider>
            )}
        </Formik>
    )
}

const ApplicantJobListDashboard = () => {
    const classes = useStyles()
    const {authTokens} = useAuth()
    const [jobs, setJobs] = useState([])
    const [jobsAppliedTo, setJobsAppliedTo] = useState([])
    const [filterFn, setFilterFn] = useState({fn: (items) => items})
    const headers = [
        {id: 'title', name: 'Title', sortable: false},
        {id: 'recName', name: 'Rec. Name', sortable: false},
        {id: 'rating', name: 'Job Rating', sortable: true},
        {id: 'salaryPerMonth', name: 'Salary', sortable: true},
        {id: 'duration', name: 'Duration', sortable: true},
        {id: 'deadline', name: 'Deadline', sortable: false},
        {id: 'type', name: 'Type', sortable: false},
        {id: 'apply', name: 'Apply', sortable: false}
    ]
    const {
        SortableTable,
        recordsAfterSorting
    } = CustomTable(jobs, headers, filterFn)

    const filter = {
        title: '',
        typeOfJob: '',
        minSalary: '',
        maxSalary: '',
        duration: ''
    }

    useEffect(() => {
        (async () => {
            try {
                console.log('token', authTokens.token)
                const response = await applicantServices.getJobsAppliedTo(authTokens.token)
                setJobsAppliedTo(response)
            } catch (err) {
                console.log('error while getting jobs applied', err)
            }
        })()
    }, [])

    useEffect(() => {
        console.log('filterfn', filterFn)
    }, [filterFn])

    const getActiveJobs = (jobs) => {
        return jobs.filter(job => new Date(job.deadline) > new Date())
    }

    useEffect(() => {
        (async () => {
            const response = await jobService.getAll()
            for (let ind in response) {
                if (response[ind].ratings.length > 0)
                    response[ind]['rating'] = (response[ind].ratings
                        .reduce((acc, el) => acc + el.value, 0)) / response[ind].ratings.length
                else
                    response[ind]['rating'] = 0
            }
            console.log('response', response)
            setJobs(getActiveJobs(response))
        })()
    }, [filterFn])

    useEffect(() => {
        console.log('jobs', jobs)
    }, [jobs])

    return (
        <div>
            <div className={classes.appBarSpacer}/>
            <Typography variant="h3" component="h5">
                Browse Jobs
            </Typography>
            <Grid>
                <Paper style={{padding: '40px', marginBottom: '40px'}}>
                    <Typography variant="h4" component="h5">
                        Filter
                    </Typography>
                    <FilterForm filter={filter} setFilterFn={setFilterFn} classes={classes}/>
                </Paper>
                <Paper>
                    <SortableTable
                        records={jobs}
                        headCells={headers}
                        filterFn={filterFn}
                        setData={setJobs}
                    >
                        <TableBody>
                            {recordsAfterSorting().map(item => (
                                <TableRow key={item._id}>
                                    <TableCell>{item.title}</TableCell>
                                    <TableCell>{item.recruiter.user.name}</TableCell>
                                    <TableCell>
                                        <Rating name="read-only" precision={0.5} size='small' value={item.rating} readOnly />
                                    </TableCell>
                                    <TableCell>{item.salaryPerMonth}</TableCell>
                                    <TableCell>{item.duration}</TableCell>
                                    <TableCell>{format((new Date(item.deadline)), 'dd-MM-yyyy\'T\'HH:mm')}</TableCell>
                                    <TableCell>{item.typeOfJob}</TableCell>
                                    <TableCell>
                                        {jobsAppliedTo.indexOf(item._id) >= 0 ?
                                            <Button disabled color='secondary'>Applied</Button>
                                            :
                                            (item.applicationStatus === 'full' || item.positionStatus === 'full' ?
                                                    <Button
                                                        disabled
                                                        classes={{ disabled: classes.disabledButton }}
                                                        variant='contained'
                                                    >
                                                        Full
                                                    </Button>
                                                    :
                                                    <Button
                                                        variant='outlined'
                                                        color='primary'
                                                        href={`/apply/${item._id}`}
                                                    >
                                                        Apply
                                                    </Button>
                                            )
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

export default ApplicantJobListDashboard
