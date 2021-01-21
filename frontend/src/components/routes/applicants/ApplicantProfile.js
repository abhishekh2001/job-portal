import useStyles from '../../styles/generalStyles'
import {useAuth} from '../../../context/auth'
import {useEffect, useState} from 'react'
import {Box, Chip, makeStyles, Paper, Table, TableBody, TableCell, TableHead, TableRow} from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import applicantServices from '../../../services/applicantServices'
import App from '../../../App'
import {Alert, Rating} from '@material-ui/lab'

const chipStyles = makeStyles((theme) => ({
    chipContainer: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0.5),
        },
    },
}))

const DisplayProfile = ({applicant, setEdit}) => {
    const classes = chipStyles()
    let ratingValue
    if (applicant.ratings.length >= 0)
        ratingValue = applicant.ratings.reduce((sum, curr) => sum = sum + curr.value, 0) / applicant.ratings.length

    return (
        <Paper>
            <Grid container spacing={2} style={{padding: '30px', fontSize: '1.6em'}}>
                <Grid item xs={12}>
                    <b>Name:</b> {applicant.user.name}
                </Grid>
                <Grid item xs={12}>
                    <b>EmailId:</b> {applicant.user.email}
                </Grid>
                <Grid item xs={12}>
                    <b>Education:</b> <br />
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Institute Name</TableCell>
                                <TableCell>Start Year</TableCell>
                                <TableCell>End year</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {applicant.education.map(ed => (
                                <TableRow key={ed._id}>
                                    <TableCell>{ed.instituteName}</TableCell>
                                    <TableCell>{ed.startYear}</TableCell>
                                    <TableCell>{ed.endYear}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Grid>
                <Grid item xs={12}>
                    Skills:
                    <Grid className={classes.chipContainer}>
                        {applicant.skills.map((sk, it) => (
                            <Chip key={it} label={sk} />
                        ))}
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    Rating: <Rating disabled precision={0.2} value={ratingValue} />
                </Grid>
            </Grid>
        </Paper>
    )
}

const ApplicantProfile = () => {
    const classes = useStyles()
    const {authTokens} = useAuth()
    const [edit, setEdit] = useState(false)
    const [message, setMessage] = useState(null)
    const [currApplicant, setCurrApplicant] = useState(null)

    useEffect(() => {
        (async () => {
            try {
                console.log('inside')
                const response = await applicantServices.getApplicant(authTokens.token)
                setCurrApplicant(response)
            } catch (err) {
                console.log('err', err.response)
                if (err.response && err.response.data && err.response.data.error)
                    setMessage(err.response.data.error)
                else
                    setMessage('Something went wrong')
            }
        })()
    }, [])

    return (
        <div>
            <div className={classes.appBarSpacer} />
            {message && <Alert severity='error'>{message}</Alert> }
            {
                !edit && currApplicant && <DisplayProfile applicant={currApplicant} setEdit={setEdit} />
            }
        </div>
    )
}

export default ApplicantProfile
