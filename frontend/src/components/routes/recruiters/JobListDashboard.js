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
    }, [authTokens.token])

    const getUpdatedJob = async (id) => {
        const job = await jobService.getOne(id)
        setJobs(jobs.map(j => j._id.toString() === id ? job : j))
    }

    const deleteJob = async (id) => {
        try {
            await jobService.deleteOne(id, authTokens.token)
            setJobs(jobs.filter(j => j._id !== id))
        } catch (err) {
            console.log('caught err', err)
        }
    }

    return (
        <div>
            <div className={classes.appBarSpacer} />
            <Grid container spacing={2}>
                {jobs.map(job => (
                    <Grid item xs={12} md={12} sm={4} key={job._id}>
                        <JobCard job={job} setOpenPopup={setOpenPopup} deleteJob={() => deleteJob(job._id)} />

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
