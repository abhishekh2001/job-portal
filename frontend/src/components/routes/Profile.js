import { Route, Redirect } from "react-router-dom"
import {useAuth} from '../../context/auth'
import ApplicantProfile from './applicants/ApplicantProfile'
import RecruiterProfile from './recruiters/RecruiterProfile'

const Profile = () => {
    const {authTokens} = useAuth()

    return (
        <div>
            {authTokens.type === 'applicant' ?
                <ApplicantProfile />
                :
                <RecruiterProfile />
            }
        </div>
    )
}

export default Profile