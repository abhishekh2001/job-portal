// Joblistings for the applicants
import React, {useState, useEffect} from 'react'
import jobService from '../../../services/jobService'
import Grid from '@material-ui/core/Grid'
import useStyles from '../../styles/generalStyles'
import {Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography} from '@material-ui/core'
import Toolbar from '@material-ui/core/Toolbar'

const ApplicantJobListDashboard = () => {
    const classes = useStyles()
    const [jobs, setJobs] = useState([])
    const headers = [
        {id: 'title', name: 'Title', sortable: false},
        {id: '', name: 'Rec. Name', sortable: false},
        {name: 'Job Rating', sortable: true},
        {name: 'Salary', sortable: true},
        {name: 'Duration', sortable: true},
        {name: 'Deadline', sortable: false},
        {name: 'Type', sortable: false}
    ]

    const getActiveJobs = (jobs) => {
        return jobs.filter(job => new Date(job.deadline) > new Date())
    }

    useEffect(() => {
        (async () => {
            const response = await jobService.getAll()
            console.log('response', response)
            setJobs(getActiveJobs(response))
        })()
    }, [])

    return (
        <div>
            <div className={classes.appBarSpacer}/>
            <Paper>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            {headers.map(header => (
                                <TableCell>{header.name}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {jobs.map(item => (
                            <TableRow key={item._id}>
                                <TableCell>{item.title}</TableCell>
                                <TableCell>{item.recruiter.user.name}</TableCell>
                                <TableCell>{item.rating}</TableCell>
                                <TableCell>{item.salaryPerMonth}</TableCell>
                                <TableCell>{item.duration}</TableCell>
                                <TableCell>{item.deadline}</TableCell>
                                <TableCell>{item.typeOfJob}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </div>
    )
}

export default ApplicantJobListDashboard
