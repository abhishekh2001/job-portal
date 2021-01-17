import recruiterService from '../../../services/recruiterService'
import {useAuth} from '../../../context/auth'
import {Button, withMobileDialog} from '@material-ui/core'
import useStyles from '../../styles/generalStyles'
import {useEffect, useState} from 'react'
import JobCard from './JobCard'
import Grid from '@material-ui/core/Grid'
import JobEditPopup from './JobEditPopup'
import JobEditForm from '../../forms/JobEditForm'
import LoginForm from '../../forms/LoginForm'
import jobService from '../../../services/jobService'

const JobListDashboard = () => {
    const classes = useStyles()
    const { authTokens } = useAuth()
    const [jobs, setJobs] = useState([])
    const [openPopup, setOpenPopup] = useState(false)

    useEffect(() => {
        const getRecruiterJobs = async () => {
            try {
                const response = await recruiterService.getRecruiterJobs(authTokens.token)
                console.log('response jobs', response)
                setJobs(response)
            } catch (err) {
                console.log('err', err.response)
            }
        }

        getRecruiterJobs()
    }, [])

    const getUpdatedJob = async (id) => {
        const job = await jobService.getOne(id)
        setJobs(jobs.map(j => j._id.toString() === id ? job : j))
    }

    return (
        <div>
            <div className={classes.appBarSpacer} />
            <Button color='secondary' variant='contained'>
                Click me!
            </Button>
            <Grid container spacing={2}>
                {jobs.map(job => (
                    <Grid item xs={12} sm={4} key={job._id}>
                        <JobCard job={job} setOpenPopup={setOpenPopup} />

                        <JobEditPopup
                            openPopup={openPopup}
                            setOpenPopup={setOpenPopup}
                            title={job.title}
                        >
                            <JobEditForm
                                job={job}
                                handleOnUpdate={() => getUpdatedJob(job._id.toString())}
                                setOpenPopup={setOpenPopup}
                            />
                        </JobEditPopup>

                    </Grid>
                ))}
            </Grid>
        </div>
    )
}

export default JobListDashboard
