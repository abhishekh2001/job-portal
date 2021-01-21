import {useAuth} from '../../../context/auth'
import React, {useEffect, useState} from 'react'
import CustomTable from '../../CustomTable'
import useStyles from '../../styles/generalStyles'
import jobService from '../../../services/jobService'
import {
    Box, ButtonGroup, Chip,
    Collapse, Divider,
    makeStyles,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import format from 'date-fns/format'
import {Alert, Rating} from '@material-ui/lab'
import Button from '@material-ui/core/Button'
import applicationService from '../../../services/applicationService'

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
    miniTableHead: {
        '& > *': {
            fontWeight: 'bold'
        }
    },
    chip: {
        margin: '5px',
    },
    chipArray: {
        display: 'flex',
        flexWrap: 'wrap',
        listStyle: 'none',
        margin: 0
    }
})


const CustomTableRow = ({item, setMessage, recToken}) => {
    const [open, setOpen] = useState(false)
    const classes = useRowStyles()
    let choice
    const updateStatus = async (status) => {
        const body = {
            status
        }
        try {
            const updated = await applicationService.updateApplicationStatus(item._id.toString(), body, recToken)
            console.log('response', updated)
            window.location.reload()
        } catch (err) {
            console.log('err', err.response)
            setMessage({severity: 'error', content: err.response.data.error})
        }
    }
    if (item.status === 'applied') {
        choice = (
            <ButtonGroup>
                <Button color='primary' onClick={() => updateStatus('shortlisted')}>Shortlist</Button>
                <Button color='secondary' onClick={() => updateStatus('rejected')}>Reject</Button>
            </ButtonGroup>
        )
    } else if (item.status === 'shortlisted') {
        choice = (
            <ButtonGroup>
                <Button color='primary' onClick={() => updateStatus('accepted')}>Accept</Button>
                <Button color='secondary' onClick={() => updateStatus('rejected')}>Reject</Button>
            </ButtonGroup>
        )
    } else {
        choice = (
            <Button fullWidth disabled>Accepted</Button>
        )
    }

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell>{item.appName}</TableCell>
                <TableCell>{format((new Date(item.dateOfApplication)), 'yyyy-MM-dd\'T\'HH:mm')}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell><Rating name="read-only" value={item.applicantRating} precision={0.5} readOnly/></TableCell>
                <TableCell>
                    {choice}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div" style={{fontWeight: 'bold'}}>
                                Education
                            </Typography>
                            <Table size="small" aria-label="Education">
                                <TableHead>
                                    <TableRow className={classes.miniTableHead}>
                                        <TableCell>Institute Name</TableCell>
                                        <TableCell>Start Year</TableCell>
                                        <TableCell>End Year</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {item.applicant.education.map(ed => (
                                        <TableRow key={ed._id}>
                                            <TableCell component="th" scope="row">
                                                {ed.instituteName}
                                            </TableCell>
                                            <TableCell>{ed.startYear}</TableCell>
                                            <TableCell>{ed.endYear}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Divider/>
                            <Grid container style={{marginTop: '30px'}}>
                                <Grid item xs={2}>
                                    <Typography variant="h6" gutterBottom component="div" style={{fontWeight: 'bold'}}>
                                        Skills
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Grid className={classes.chipArray} component='ul'>
                                        {item.applicant.skills.map((sk, it) => (
                                            <li key={it}>
                                                <Chip
                                                    icon={null}
                                                    label={sk}
                                                    className={classes.chip}
                                                />
                                            </li>
                                        ))}
                                    </Grid>
                                </Grid>
                                <Grid container style={{marginTop: '30px'}}>
                                    <Typography variant="h6" gutterBottom component="div" style={{fontWeight: 'bold'}}>
                                        Statement of Purpose
                                    </Typography>
                                    <Grid item xs={12}
                                          style={{backgroundColor: '#6C7A89',
                                              color: 'white',
                                              padding: '30px',
                                              whiteSpace: 'pre-wrap'
                                          }}>
                                        {item.sop}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    )
}

const ViewApplications = (props) => {
    const classes = useStyles()
    const {authTokens} = useAuth()
    const [applications, setApplications] = useState([])
    const [message, setMessage] = useState(null)
    const [jobTitle, setJobTitle] = useState('')
    const [filterFn, setFilterFn] = useState({fn: (items) => items})
    const {jobId} = props.match.params
    const headers = [
        {id: 'bl', name: '', sortable: false},
        {id: 'appName', name: 'Name', sortable: true},
        {id: 'dateOfApplication', name: 'Application date', sortable: true},
        {id: 'state', name: 'State', sortable: false},
        {id: 'applicantRating', name: 'Rating', sortable: true},
        {id: 'proceed', name: 'Choose', sortable: false}
    ]
    const {
        SortableTable,
        recordsAfterSorting
    } = CustomTable(applications, headers, filterFn)

    useEffect(() => {
        (async () => {
            try {
                const response = await jobService.getApplications(jobId)
                console.log('immediate', response)
                for (let ind in response) {
                    let applicantRating = 0
                    if (response[ind].applicant.ratings.length > 0) {
                        console.log('rating in ', response[ind])
                        applicantRating = response[ind].applicant.ratings
                            .reduce((cum, cur) => cum + cur.value, 0) / response[ind].applicant.ratings.length
                    }
                    response[ind].appName = response[ind].applicant.user.name
                    response[ind].applicantRating = applicantRating
                    console.log('name', response[ind].applicant.user.name)
                }
                console.log('response modified to ', response)
                setApplications(response.filter(ap => ap.status !== 'rejected'))

                const job = await jobService.getOne(jobId)
                setJobTitle(job.title)
            } catch (err) {
                console.log('error', err)
            }
        })()
    }, [jobId])

    return (
        <div>
            <div className={classes.appBarSpacer}/>
            {message && <Alert severity={message.severity}>{message.content}</Alert> }
            <Grid container style={{marginBottom: '40px'}}>
                <Grid item xs={12}>
                    <Typography variant="h3" component='h5'>
                        {jobTitle}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h4" component="h6">
                        View applications
                    </Typography>
                </Grid>
            </Grid>
            <Grid>
                <Paper>
                    <SortableTable
                        records={applications}
                        headCells={headers}
                        filterFn={filterFn}
                        setData={setApplications}
                    >
                        <TableBody>
                            {recordsAfterSorting().map(item => (
                                <CustomTableRow
                                    item={item}
                                    key={item._id}
                                    setMessage={setMessage}
                                    recToken={authTokens.token}
                                />
                            ))}
                        </TableBody>
                    </SortableTable>
                </Paper>
            </Grid>
        </div>
    )
}

export default ViewApplications
