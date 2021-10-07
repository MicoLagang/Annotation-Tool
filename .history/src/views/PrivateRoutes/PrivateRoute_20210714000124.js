import React from 'react'
import { Route } from 'react-router-dom'
import { useAuth } from '../../logic/context/AuthContext'

export default function PrivateRoute({ component: Component, ...rest}) {
    const { currentUser } = useAuth()

    return (
        <Route {...rest} render={props => {
            return currentUser ? <Component {...props}></Component> : <Redirect to="/login"></Redirect>
        }}>

        </Route>
    )
}
