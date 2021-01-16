import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import JobPostForm from '../../forms/JobPostForm'
import useStyles from '../../styles/generalStyles'

const JobPostDashboard = () => {
    const classes = useStyles()
    // TODO: Redirect to jobs listing on successful job post
    return (
        <div>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container justify="center">
                    <Grid item>
                        <Paper xs={12} elevation={3} className={classes.paper}>
                            <JobPostForm/>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}

export default JobPostDashboard
