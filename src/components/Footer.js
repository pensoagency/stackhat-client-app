import React from 'react'
import { inject } from 'mobx-react'
import { Navbar, Nav, NavItem } from 'react-bootstrap'
import Version from '../services/Version'

class Footer extends React.Component {
  render() {
    if (this.props.Authentication.IsAuthenticated) {

      return (
        <footer className="text-center">
          &copy; My Company Ltd
          <span className="version">v{Version}</span>
        </footer>
      )
    }
    else {
      return (
        <span className="version login">v{Version}</span>
      )
    }
  }
}

export default inject("Authentication")(Footer)