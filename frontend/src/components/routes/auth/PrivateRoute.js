import { Route, Redirect } from "react-router-dom"
import {useAuth} from '../../../context/auth'

function PrivateRoute({type, component: Component, ...rest}) {
    const { authTokens } = useAuth()
    console.log('authTokens', authTokens)

    return (
        <Route
            {...rest}
            render={props =>
                authTokens && authTokens.token && (type ? authTokens.type === type : true) ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    );
}

export default PrivateRoute
