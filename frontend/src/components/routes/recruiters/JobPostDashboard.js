import React from 'react'
import clsx from 'clsx'
import {makeStyles} from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Drawer from '@material-ui/core/Drawer'
import Box from '@material-ui/core/Box'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Badge from '@material-ui/core/Badge'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Link from '@material-ui/core/Link'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import NotificationsIcon from '@material-ui/icons/Notifications'
import {mainListItems, secondaryListItems} from '../../listitems'
import JobPostForm from '../../forms/JobPostForm'
import {Button} from '@material-ui/core'
import AppToolBar from '../../AppToolBar'
import useStyles from '../../styles/generalStyles'

export default function JobPostDashboard() {
    const classes = useStyles()
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

