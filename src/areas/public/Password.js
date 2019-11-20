import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Panel } from 'react-bootstrap'
import { inject } from 'mobx-react'
import Notify from '../../services/Notify'
import FieldGroup from '../../components/forms/FieldGroup'
import LoginLogo from './LoginLogo'

class Password extends React.Component {
  state = {
    completed: false,
    userName: ""
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.Authentication.ForgotPassword(this.state.userName)
      .then(() => {
        this.setState(() => ({ completed: true }))
      })
      .catch((error) => {
        Notify.error(error.error_description)
        this.setState(() => ({ completed: false }))
      });
  }

  render() {

    return (

      <div className="text-center">
        <form className="form-signin" onSubmit={this.handleSubmit}>
          <LoginLogo />

          {!this.state.completed ?

            <div>
              <Panel>
                <Panel.Body>
                  <p>Please enter your email</p>

                  <FieldGroup type="email" name="userName" value={this.state.userName} onChange={this.handleInputChange} placeholder="Enter email" required />
                  <Button type="submit" bsStyle="primary" block>Recover Password</Button>

                </Panel.Body></Panel>
              <Link to="/">Back to login</Link>
            </div>

            :

            <div>
              <Panel>
                <Panel.Body>
                  
              <strong>Please check your email</strong>
              <p>Check your email for further instructions on resetting your password.</p>
              </Panel.Body></Panel>
              <Link to="/">Back to login</Link>
            </div>

          }

        </form>
      </div>

    )

  }
}

export default inject("Authentication")(Password)