import RecruiterForm from '../../forms/RecruiterForm'
import {useState} from 'react'
import {ButtonGroup, Container, CssBaseline, Grid, Link, makeStyles, Typography} from '@material-ui/core'
import Button from '@material-ui/core/Button'
import 'fontsource-roboto'

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    centerContainer: {
        alignItems: 'center',
        direction: 'column',
        justify: 'center',
    }
}))

const Register = () => {
    const classes = useStyles()

    return (
        <Container component="main" maxWidth="xs">
            <Grid
                container
                direction="column"
                alignItems="center"
                justify="center"
                style={{height: '100vh'}}
            >
                <Grid container
                      spacing={0}
                      direction="column"
                      alignItems="center"
                      justify="center"
                      style={{background: '#efefef', paddingBottom: '20px'}}
                >
                    <Typography component="h1" variant="h2" style={{margin: '10px', color: '#414141'}}>
                        Register as
                    </Typography>
                    <ButtonGroup>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            href="/applicantRegister"
                        >
                            Applicant
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            size="large"
                            href="/recruiterRegister"
                        >
                            Recruiter
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Register
