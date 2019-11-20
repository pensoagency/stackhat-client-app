import React from 'react'
import { inject } from 'mobx-react'
import { Redirect } from 'react-router-dom'

class Logout extends React.Component {
  componentWillMount() {
    this.props.Authentication.SignOut(() => {
      history.pushState({}, null, "/")
    })
  }
  render() {
    return <Redirect to="/" />
  }
}

export default inject("Authentication")(Logout)