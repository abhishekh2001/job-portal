import {BrowserRouter, Route} from 'react-router-dom'
import Home from './components/Home'
import Register from './components/routes/auth/Register'
import ApplicantRegister from './components/routes/auth/ApplicantRegister'
import RecruiterRegister from './components/routes/auth/RecruiterRegister'
import Login from './components/routes/auth/Login'
import JobPostDashboard from './components/routes/recruiters/JobPostDashboard'
import {AuthContext} from './context/auth'
import PrivateRoute from './components/routes/auth/PrivateRoute'
import {useState} from 'react'
import Admin from './components/routes/Admin'
import Dashboard from './components/Test'

const App = () => {
    const existingTokens = JSON.parse(localStorage.getItem('tokens') || null)
    const [authTokens, setAuthTokens] = useState(existingTokens)

    const setTokens = (data) => {
        localStorage.setItem("tokens", JSON.stringify(data));
        setAuthTokens(data)
    }

    return (
        <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
            <BrowserRouter>
                <div>
                    <br/>
                    <Route path='/' exact component={Home}/>
                    <Route path='/register' component={Register}/>
                    <Route path='/applicantRegister' component={ApplicantRegister}/>
                    <Route path='/recruiterRegister' component={RecruiterRegister}/>
                    <Route path='/login' component={Login}/>

                    <PrivateRoute path='/jobPostDashboard'
                                  type='recruiter'
                                  component={JobPostDashboard}
                    />

                    <Route path='/dashboard' component={Home}/>

                    <Route path='/admin' component={Admin} />


                    <Route path='/Test' component={Dashboard} />
                </div>
            </BrowserRouter>
        </AuthContext.Provider>
    )
}

export default App
