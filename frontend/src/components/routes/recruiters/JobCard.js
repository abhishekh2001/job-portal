import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    root: {
        maxWidth: 340,
    },
    media: {
        height: 'auto',
    },
});

const JobCard = ({job, setOpenPopup, deleteJob}) => {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardActionArea>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {job.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        Date of posting: {job.dateOfPosting} <br />
                        Number of applicants: {job.currApplicants}<br />
                        Positions left: {job.maxPositions - job.currPositions}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button size="small" color="primary" onClick={() => setOpenPopup(true)}>
                    Edit
                </Button>
                <Button size="small" color="secondary" onClick={deleteJob}>
                    Delete
                </Button>
            </CardActions>
        </Card>
    );
}

export default JobCard
