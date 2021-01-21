import {BrowserRouter, Route} from 'react-router-dom'
import Home from './components/Home'
import Register from './components/routes/auth/Register'
import ApplicantRegister from './components/routes/auth/ApplicantRegister'
import RecruiterRegister from './components/routes/auth/RecruiterRegister'
import Login from './components/routes/auth/Login'
import JobPostDashboard from './components/routes/recruiters/JobPostDashboard'
import JobListDashboard from './components/routes/recruiters/JobListDashboard'
import ApplicantJobListDashboard from './components/routes/applicants/JobListDashboard'
import {AuthContext} from './context/auth'
import PrivateRoute from './components/routes/auth/PrivateRoute'
import {useState} from 'react'
import Admin from './components/routes/Admin'
import Dashboard from './components/Test'
import AppToolBar from './components/AppToolBar'
import ApplyToJob from './components/routes/applicants/Apply'
import MyApplications from './components/routes/applicants/MyApplications'
import ViewApplications from './components/routes/recruiters/ViewApplications'
import MasterAuth from './components/routes/auth/MasterAuth'
import AcceptedEmployees from './components/routes/recruiters/AcceptedEmployees'

const App = () => {
    const existingTokens = JSON.parse(localStorage.getItem('tokens') || null)
    const [authTokens, setAuthTokens] = useState(existingTokens)

    const setTokens = (data) => {
        localStorage.setItem('tokens', JSON.stringify(data))
        setAuthTokens(data)
    }

    return (
        <AuthContext.Provider value={{authTokens, setAuthTokens: setTokens}}>
            <AppToolBar>
                <BrowserRouter>
                    <div>
                        <br/>
                        <Route exact path='/' component={Home}/>
                        <Route path='/register' component={MasterAuth}/>
                        <Route exact path='/newUser' component={MasterAuth}/>
                        <Route path='/applicantRegister' component={ApplicantRegister}/>
                        <Route path='/recruiterRegister' component={RecruiterRegister}/>
                        <Route path='/login' component={Login}/>

                        <PrivateRoute path='/jobPostDashboard'
                                      type='recruiter'
                                      component={JobPostDashboard}
                        />
                        <PrivateRoute path='/jobListDashboard'
                                      type='recruiter'
                                      component={JobListDashboard}
                        />
                        <PrivateRoute path='/viewApplications/:jobId'
                                      type='recruiter'
                                      component={ViewApplications}
                                      exact
                        />
                        <PrivateRoute path='/acceptedEmployees'
                                      type='recruiter'
                                      component={AcceptedEmployees}
                                      exact
                        />

                        <PrivateRoute path='/browseJobs'
                                      type='applicant'
                                      component={ApplicantJobListDashboard}
                        />
                        <PrivateRoute path='/apply/:jobId'
                                      type='applicant'
                                      component={ApplyToJob}
                        />

                        <PrivateRoute path='/myApplications'
                                      type='applicant'
                                      component={MyApplications}
                        />

                        <Route path='/dashboard' component={Home}/>

                        <Route path='/admin' component={Admin}/>


                        <Route path='/Test' component={Dashboard}/>
                    </div>
                </BrowserRouter>
            </AppToolBar>
        </AuthContext.Provider>
    )
}

export default App
