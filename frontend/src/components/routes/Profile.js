import { Route, Redirect } from "react-router-dom"
import {useAuth} from '../../context/auth'
import ApplicantProfile from './applicants/ApplicantProfile'

const Profile = () => {
    const {authTokens} = useAuth()

    return (
        <div>
            {authTokens.type === 'applicant' ?
                <ApplicantProfile />
                :
                null
            }
        </div>
    )
}

export default Profile