import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';
import {Link} from 'react-router-dom'
import Divider from '@material-ui/core/Divider'
import LockOpenIcon from '@material-ui/icons/LockOpen';

export const recruiterListItems = (
    <div>
        <ListItem button component={Link} to='/profile'>
            <ListItemIcon>
                <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
        </ListItem>
        <ListItem button component={Link} to='/jobPostDashboard'>
            <ListItemIcon>
                <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="Create Job" />
        </ListItem>
        <ListItem button component={Link} to='/acceptedEmployees'>
            <ListItemIcon>
                <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Accepted Emp" />
        </ListItem>
        <ListItem button component={Link} to='/jobListDashboard'>
            <ListItemIcon>
                <BarChartIcon />
            </ListItemIcon>
            <ListItemText primary="View Jobs" />
        </ListItem>
        <Divider />
        <ListItem button component={Link} to='/admin'>
            <ListItemIcon>
                <LayersIcon />
            </ListItemIcon>
            <ListItemText primary="Log out" />
        </ListItem>
    </div>
)

export const applicantListItems = (
    <div>
        <ListItem button component={Link} to='/profile'>
            <ListItemIcon>
                <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
        </ListItem>
        <ListItem button component={Link} to='/browseJobs'>
            <ListItemIcon>
                <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="Browse Jobs" />
        </ListItem>
        <ListItem button component={Link} to='/myApplications'>
            <ListItemIcon>
                <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="My applications" />
        </ListItem>
        <Divider />
        <ListItem button component={Link} to='/admin'>
            <ListItemIcon>
                <LayersIcon />
            </ListItemIcon>
            <ListItemText primary="Log out" />
        </ListItem>
    </div>
)

export const unLoggedListItems = (
    <div>
        <ListItem button component={Link} to='/register'>
            <ListItemIcon>
                <LockOpenIcon />
            </ListItemIcon>
            <ListItemText primary="Register" />
        </ListItem>
        <ListItem button component={Link} to='/login'>
            <ListItemIcon>
                <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Log in" />
        </ListItem>
    </div>
)