import recruiterService from '../../../services/recruiterService'
import {useAuth} from '../../../context/auth'
import {Button, withMobileDialog} from '@material-ui/core'
import useStyles from '../../styles/generalStyles'
import {useEffect, useState} from 'react'

const JobListDashboard = () => {
    const classes = useStyles()
    const { authTokens } = useAuth()
    const [jobs, setJobs] = useState([])

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

    return (
        <div>
            <div className={classes.appBarSpacer} />
            <Button color='secondary' variant='contained'>
                Click me!
            </Button>
            {jobs.map(job => (
                <div key={job._id}>{job.title}</div>
            ))}
        </div>
    )
}

export default JobListDashboard
