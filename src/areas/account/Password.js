import React from 'react'
import { Panel, Grid, Row, Col, Button } from 'react-bootstrap'
import { observer, inject } from 'mobx-react'
import MobxReactForm from 'mobx-react-form'
import ChangePasswordForm from './password/ChangePasswordForm'
import { Input } from '../../components/forms'

class Password extends React.Component {

  componentWillMount() {
    let changePasswordForm = new ChangePasswordForm(this.props.AppUserStore)
    this.changePasswordForm = new MobxReactForm(changePasswordForm.fieldInfo, changePasswordForm.formInfo)
  }

  render() {

    var cpf = this.changePasswordForm

    return (

      <Grid fluid>
        <Row className="show-grid">
          <Col md={12}>
            <form>
              <Panel>
                <Panel.Heading>Change Password</Panel.Heading>
                <Panel.Body>
                  {this.renderField(cpf, "Password")}
                  {this.renderField(cpf, "NewPassword")}
                  {this.renderField(cpf, "ConfirmNewPassword")}
                  <Button onClick={cpf.onSubmit}>Change Password</Button>
                </Panel.Body>
              </Panel>
            </form>
          </Col>
        </Row>
      </Grid>
    )
  }

  renderField(form, fieldName) {
    var field = form.$(fieldName)
    return (<Input key={field.name} field={field} />)
  }
}

export default inject("AppUserStore")(observer(Password))