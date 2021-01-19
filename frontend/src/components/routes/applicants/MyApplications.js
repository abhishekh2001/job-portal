import React, {useState, useEffect} from 'react'
import Grid from '@material-ui/core/Grid'
import useStyles from '../../styles/generalStyles'
import {
    Button, Paper,
    TableBody, TableCell, TableRow,
    Typography
} from '@material-ui/core'
import applicantServices from '../../../services/applicantServices'
import {useAuth} from '../../../context/auth'
import CustomTable from '../../CustomTable'
import format from 'date-fns/format'

const MyApplications = () => {
    const classes = useStyles()
    const {authTokens} = useAuth()
    const [myApplications, setMyApplications] = useState([])
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
                                                <Button variant='outlined'>
                                                    Rate
                                                </Button>
                                                :
                                                'Not accepted'
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
