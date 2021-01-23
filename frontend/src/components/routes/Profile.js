import { Route, Redirect } from "react-router-dom"
import {useAuth} from '../../context/auth'
import ApplicantProfile from './applicants/ApplicantProfile'
import RecruiterProfile from './recruiters/RecruiterProfile'

const Profile = () => {
    const {authTokens} = useAuth()

    let profile = null
    if (authTokens && authTokens.type === 'applicant')
        profile = <ApplicantProfile />
    else if (authTokens)
        profile = <RecruiterProfile />

    return (
        <div>
            {profile}
        </div>
    )
}

export default Profile