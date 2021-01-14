import RecruiterForm from '../../forms/RecruiterForm'
import {useState} from 'react'
import Alert from '@material-ui/lab/Alert'

const Register = () => {
    const [message, setMessage] = useState(null)

    return (
        <div>
            {message !== null ?
                <Alert severity="error">{message}</Alert>
                :
                null
            }
            <RecruiterForm setMessage={setMessage} />
        </div>
    )
}

export default Register
