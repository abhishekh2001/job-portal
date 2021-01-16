import React, {useEffect} from 'react'
import Button from '@material-ui/core/Button'
import useStyles from './styles/generalStyles'

const Home = () => {
    const classes = useStyles()
    return (
        <div>
            <div className={classes.appBarSpacer}/>
            <Button variant="contained" color="secondary">
                Hello World
            </Button>
        </div>
    )
}

export default Home
