import './index.css'
import {BrowserRouter, Route} from 'react-router-dom'
import Home from './components/Home'
import Register from './components/routes/auth/Register'

const App = () => {
    return (
        <BrowserRouter>
            <div>
                <br/>
                <Route path='/' exact component={Home}/>
                <Route path='/register' component={Register}/>
                {/*<Route path='/login' component={Login}/>*/}
            </div>
        </BrowserRouter>
    )
}

export default App
