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

    const getActiveJobs = jobs => {
        return jobs.filter(j => j.positionStatus === 'free')
    }

    useEffect(() => {
        const getRecruiterJobs = async () => {
            try {
                const response = await recruiterService.getRecruiterJobs(authTokens.token)
                console.log('response jobs', response)
                setJobs(getActiveJobs(response))
            } catch (err) {
                console.log('err', err.response)
            }
        }

        getRecruiterJobs()
    }, [authTokens.token])

    const getUpdatedJob = async (id) => {
        const job = await jobService.getOne(id)
        const updatedJobs = jobs.map(j => j._id.toString() === id ? job : j)
        setJobs(getActiveJobs(updatedJobs))
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
                    <Grid item xs={12} sm={4} key={job._id}>
                        <JobCard job={job} deleteJob={() => deleteJob(job._id)} getUpdatedJob={getUpdatedJob} />
                    </Grid>
                ))}
            </Grid>
        </div>
    )
}

export default JobListDashboard
