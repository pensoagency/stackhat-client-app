import React from 'react'
import { Redirect, Link } from 'react-router-dom'
import { Button, Alert, Panel } from 'react-bootstrap'
import { inject } from 'mobx-react'
import QueryString from 'query-string'
import Notify from '../../services/Notify'
import FieldGroup from '../../components/forms/FieldGroup'
import LoginLogo from './LoginLogo'
import LoadingSpinner from '../../components/LoadingSpinner'

class Login extends React.Component {

  state = {
    redirectToReferrer: false,
    mode: "normal",
    userName: "",
    password: "",
    message: ""
  }

  componentDidMount() {
    // reset stores
    this.props.Stores.Reset()

    var qs = QueryString.parse(location.search)
    var hash = QueryString.parse(location.hash)

    // sign out on unauth
    if (qs.reason === "unauth" || qs.reason === "idle") {
      this.props.Authentication.SignOut()
      this.setState({ message: qs.reason === "idle" ? "Your session has expired" : "Authentication is required." })
    }

    // sso
    if (qs.mode === "sso") {
      this.setState({ mode: "sso", sso: "init" })
    } else if (hash.id_token) {
      this.setState({ mode: "sso", sso: "authed" })
      this.loginSSO(hash.id_token)
    }

  }

  login = (event) => {
    event.preventDefault();

    this.props.Authentication.Authenticate({
      type: "password",
      credentials: {
        userName: this.state.userName,
        password: this.state.password,
      },
      success: () => {
        this.setState(() => ({ redirectToReferrer: true }))

        // clear body class
        document.body.className = ""
      },
      error: (error) => {
        Notify.error(error.error_description)
      }
    });
  }

  loginSSO = (id_token) => {

    this.props.Authentication.Authenticate({
      type: "id_token",
      credentials: { id_token },
      success: () => {
        this.setState(() => ({ redirectToReferrer: true }))

        // clear body class
        document.body.className = ""
      },
      error: (error) => {
        this.setState({ sso: "error", message: error.error_description ? error.error_description : error.toString() })
      }
    })
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    const { mode, sso, message } = this.state

    if (this.props.Authentication.IsAuthenticated) {
      return <Redirect to={"/audit"} />
    }

    return (
      <div className="text-center">
        <form className="form-signin" onSubmit={this.login}>
          <LoginLogo />
          {mode !== "sso" && <div>

            {message && <Alert bsStyle="warning">{message}</Alert>}

            <Panel>
              <Panel.Body>
                <p>Please sign in</p>

                <FieldGroup type="text" placeholder="Enter username" name="userName" value={this.state.userName} onChange={this.handleInputChange} required />
                <FieldGroup type="password" placeholder="Password" name="password" value={this.state.password} onChange={this.handleInputChange} required />

                <Button type="submit" bsStyle="primary" block>Sign in</Button>
              </Panel.Body>
            </Panel>

            <Link to="/password">Forgot password?</Link>
          </div>}
          {mode === "sso" && <div>
            <Panel>
              <Panel.Body>
                {sso === "init" && <p>Redirecting you to sign in provider...</p>}
                {sso === "authed" && <p>Signing you in, please wait...</p>}
                {sso === "error" && <div><p>An error occurred, please contact support.</p>{message && <p><strong>Error:</strong> {message}</p>}</div>}
                {sso !== "error" && <LoadingSpinner />}
              </Panel.Body>
            </Panel>
          </div>}
        </form>
      </div>
    )
  }
}

export default inject("Settings", "Authentication", "Stores")(Login)