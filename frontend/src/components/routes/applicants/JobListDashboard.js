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
        {name: 'Title', sortable: false},
        {name: 'Rec. Name', sortable: false},
        {name: 'Job Rating', sortable: true},
        {name: 'Salary', sortable: true},
        {name: 'Duration', sortable: true},
        {name: 'Deadline', sortable: false}
    ]

    const getActiveJobs = (jobs) => {
        return jobs.filter(job => new Date(job.deadline) > new Date())
    }

    useEffect(() => {
        (async () => {
            const response = await jobService.getAll()
            setJobs(getActiveJobs(response))
        })()
    }, [])

    return (
        <div>
            <div className={classes.appBarSpacer}/>
            <Paper className={classes.pageContent}>
                {/* <EmployeeForm /> */}
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            {headers.map(header => (
                                <TableCell>{header.name}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {jobs.map(item =>
                            (<TableRow key={item.id}>
                                <TableCell>{item.fullName}</TableCell>
                                <TableCell>{item.email}</TableCell>
                                <TableCell>{item.mobile}</TableCell>
                                <TableCell>{item.department}</TableCell>
                            </TableRow>)
                        )}
                    </TableBody>
                </Table>
            </Paper>
        </div>
    )
}

export default ApplicantJobListDashboard
