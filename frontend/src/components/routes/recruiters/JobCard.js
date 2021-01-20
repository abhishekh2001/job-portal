import React, {useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import {Link} from 'react-router-dom'
import JobEditForm from '../../forms/JobEditForm'
import JobEditPopup from './JobEditPopup'

const useStyles = makeStyles({
    root: {
        maxWidth: 340,
    },
    media: {
        height: 'auto',
    },
})

const JobCard = ({job, deleteJob, getUpdatedJob}) => {
    const classes = useStyles()
    const [openPopup, setOpenPopup] = useState(false)

    return (
        <Card className={classes.root}>
            <CardActionArea>
                <Link to={`/viewApplications/${job._id}`} style={{textDecoration: 'none', color: 'inherit'}}>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {job.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            Date of posting: {job.dateOfPosting} <br/>
                            Number of applicants: {job.currApplicants}<br/>
                            Positions left: {job.maxPositions - job.currPositions}
                            {console.log('positions left ', job.maxPositions, job.currPositions)}
                        </Typography>
                    </CardContent>
                </Link>
            </CardActionArea>
            <CardActions>
                <Button size="small" color="primary" onClick={() => setOpenPopup(true)}>
                    Edit
                </Button>
                <Button size="small" color="secondary" onClick={deleteJob}>
                    Delete
                </Button>
            </CardActions>
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
        </Card>
    )
}

export default JobCard
