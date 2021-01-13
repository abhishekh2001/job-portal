import {useEffect} from 'react'
import Button from '@material-ui/core/Button'
import authService from '../services/authService'

const Home = () => {
    return (
        <div>
            <Button variant="contained" color="secondary">
                Hello World
            </Button>
        </div>
    )
}

export default Home
