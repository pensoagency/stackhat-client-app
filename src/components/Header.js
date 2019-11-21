import React from 'react';
import { inject, observer } from 'mobx-react'
import { Navbar, Nav } from 'react-bootstrap'
import { withRouter } from 'react-router-dom'
import Config from 'react-global-configuration'
import { NavLinkItem, NavButtonItem } from './navigation'

const ConfigTheme = Config.get("theme")
const ConfigLinks = Config.get("links")

class Header extends React.Component {

  handleToggleHelp = () => {
    // if (this.props.Settings.user.pref_help_reveal)
    //   document.body.classList.remove("help-showall");
    // else
    //   document.body.classList.add("help-showall");
    // this.props.Settings.SetUserSetting("pref_help_reveal", !this.props.Settings.user.pref_help_reveal)
  }

  render() {
    let auth = this.props.Authentication
    //let showHelp = true

    if (auth.IsAuthenticated) {
      let principal = auth.Principal

      let name = `${principal.firstName} ${principal.lastName}`
      let initials = `${principal.firstName.substring(0, 1)}${principal.lastName.substring(0, 1)}`

      return (
        <header>
          <Navbar staticTop fluid>
            <Navbar.Header>
                <Navbar.Brand className="logo">
                  <div>
                  <a href="/">Stack<span className="logo-shaded">Hat</span></a>
                  </div>
                </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav>
                <NavLinkItem to="/audit" isActive={location.pathname.startsWith("/audit")} text="Create Audit" icon="laptop-code" />
                <NavLinkItem to="/stack" isActive={location.pathname.startsWith("/stack")} text="Manage Stack" icon="layer-group" />                
              </Nav>
              <Nav pullRight>
                {/* <NavButtonItem icon="question-circle" title={showHelp ? "Turn Reveal Help Off" : "Turn Reveal Help On"} onClick={this.handleToggleHelp} className={showHelp ? "help-toggle help-active" : "help-toggle help-inactive"} /> */}
                <NavLinkItem to="/account" title={name} text={initials} />
                <NavLinkItem to="/logout" text="Sign Out" icon="sign-out-alt" />
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </header>
      )
    }
    else {
      return null
    }
  }
}

export default inject("Authentication", "Settings")(withRouter(observer(Header)))