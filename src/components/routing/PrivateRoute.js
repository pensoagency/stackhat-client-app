import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import AuthenticationStore from '../../stores/AuthenticationStore'

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    AuthenticationStore.IsAuthenticated === true
      ? <Component {...props} />
      : <Redirect to={{ pathname: '/', state: { from: props.location } }} />
  )} />
)

export default PrivateRoute