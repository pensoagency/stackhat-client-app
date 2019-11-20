import React from 'react'
import { ToastContainer } from 'react-toastify'
import { Switch, Route } from 'react-router-dom'
import { inject } from 'mobx-react'
import IdleTimer from 'react-idle-timer'
import Config from 'react-global-configuration'

import Version from '../services/Version'

import LoadingBar from '../components/LoadingBar'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PrivateRoute from '../components/routing/PrivateRoute'
import PrintFrame from '../components/print/PrintFrame'

import Login from './public/Login'
import Dashboard from './dashboard'
import Account from './account'
import Logout from './public/Logout'
import Password from './public/Password'
import { ErrorBoundary } from '../components/errors';
import Theme from '../components/Theme'
import Api from '../services/Api'
import Notify from '../services/Notify'

const ConfigAuth = Config.get("auth")

class Master extends React.Component {

  componentDidMount() {
    if (ConfigAuth.versionCheck.enabled)
      this.initVersionCheck() // start version checks
  }

  handleIdle = () => {
    console.log("[MASTER]", "User is idle, sign out...")
    this.props.Authentication.RedirectLogin("idle")
  }

  initVersionCheck = () => setTimeout(this.handleVersionCheck, ConfigAuth.versionCheck.intervalMs)
  handleVersionCheck = () => {
    console.log("[APP]", "Running version check")
    Api.Authentication.versionCheck()
      .then(newVersionAvailable => {
        if (newVersionAvailable)
          Notify.newVersionReload()
        else
          this.initVersionCheck() // reinit version check        
      })
  }

  render() {

    let auth = this.props.Authentication
    let isAuth = auth.IsAuthenticated

    document.body.className = isAuth ? "" : "public"

    return (
      <div className="master" >
        <LoadingBar />
        <Theme />
        <Header />
        <div className="main container-fluid">
          <ErrorBoundary>
            <Switch>
              <Route exact path='/' component={Login} />
              <Route exact path='/password' component={Password} />
              <PrivateRoute path='/dashboard' component={Dashboard} />
              <PrivateRoute path='/dashboard/*' component={Dashboard} />
              <PrivateRoute path='/account' component={Account} />
              <PrivateRoute path='/account/*' component={Account} />
              <Route path='/logout' component={Logout} />
            </Switch>
          </ErrorBoundary>
        </div>
        <Footer />
        <ToastContainer autoClose={8000} position={'bottom-left'} />
        <PrintFrame />
        {auth.IsAuthenticated && <IdleTimer onIdle={this.handleIdle} timeout={ConfigAuth.idleTimeoutMs} />}
      </div>
    )
  }

}
export default inject("Authentication")(Master)