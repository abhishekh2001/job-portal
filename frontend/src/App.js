import {BrowserRouter, Route} from 'react-router-dom'
import Home from './components/Home'
import Register from './components/routes/auth/Register'
import ApplicantRegister from './components/routes/auth/ApplicantRegister'
import RecruiterRegister from './components/routes/auth/RecruiterRegister'
import Login from './components/routes/auth/Login'

const App = () => {
    return (
        <BrowserRouter>
            <div>
                <br/>
                <Route path='/' exact component={Home}/>
                <Route path='/register' component={Register}/>
                <Route path='/applicantRegister' component={ApplicantRegister} />
                <Route path='/recruiterRegister' component={RecruiterRegister} />
                <Route path='/login' component={Login}/>
            </div>
        </BrowserRouter>
    )
}

export default App
