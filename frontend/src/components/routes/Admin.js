import {useAuth} from '../../context/auth'
import Button from '@material-ui/core/Button'
import {Redirect} from 'react-router-dom'
import {useState} from 'react'

function Admin() {
    const [loggedIn, setLoggedIn] = useState(true)
    const { setAuthTokens } = useAuth()

    function logOut() {
        setAuthTokens(null)
        localStorage.removeItem('tokens')
        setLoggedIn(false)
    }

    if (!loggedIn) {
        return <Redirect to='/login'/>
    }

    return (
        <div>
            <div>Admin Page</div>
            <Button size="large" color="secondary" onClick={logOut}>Log out</Button>
        </div>
    )
}

export default Admin