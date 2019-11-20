import React from 'react'
import Icon from 'react-fontawesome'
import { extend } from 'lodash'
import { inject, observer } from 'mobx-react'
import { Modal, Button } from 'react-bootstrap'
import { InlineTextArea } from '../forms';
import continuousColorLegend from 'react-vis/dist/legends/continuous-color-legend';
import { BusySpinner } from '../modals';

class Help extends React.Component {

  state = {
    show: false
  }

  handleShow = (event) => {
    event.stopPropagation()
    this.setState({ show: true })
  }
  handleClose = () => {
    this.setState({ show: false })
  }

  handleUpdate = (data) => {
    this.props.Authentication.Settings.SetHelp(this.props.helpKey, data)
  }
  handleResetDefault = () => {
    if (confirm("Reset help item to system default?\n\nAny changes will be lost for all users.")) {
      this.props.Authentication.Settings.ResetHelpDefault(this.props.helpKey)
    }
  }

  render() {

    let auth = this.props.Authentication
    let help = auth.Settings.help[this.props.helpKey]
    if (!help)
      return (null)

    let { show } = this.state
    let isBusy = auth.Settings.IsLoading
    let canEdit = auth.IsInRole("OrgAdmin")

    return (
      <div className="help"
        onKeyDown={e => e.stopPropagation()}
        onClick={e => e.stopPropagation()}
        onFocus={e => e.stopPropagation()}
        onMouseOver={e => e.stopPropagation()}
      >
        <Icon name="question-circle" className="help-icon" onClick={this.handleShow} />
        <Modal show={show} dialogClassName="modal-90w" onHide={this.handleClose}>
          <Modal.Header>
            <Modal.Title>Help</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {isBusy && <BusySpinner />}
            {!isBusy && <div className="format-text">
              {!canEdit && help.Value}
              {canEdit && <InlineTextArea value={help.Value} change={this.handleUpdate} propName="Value" />}
            </div>}
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="primary" onClick={this.handleClose} disabled={isBusy}>Close</Button>
            {canEdit && help.OrganisationID && <div className="pull-left"><Button onClick={this.handleResetDefault} disabled={isBusy}>Reset To Default</Button></div>}
          </Modal.Footer>
        </Modal>
      </div>
    )
  }

}

export default inject("Authentication")(observer(Help))