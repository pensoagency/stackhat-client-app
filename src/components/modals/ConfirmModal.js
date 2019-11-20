import React from 'react'
import { Modal, Button } from 'react-bootstrap'

class ConfirmModal extends React.Component {

  handleConfirm = () => {
    this.props.onConfirm()
  }

  render() {

    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header>
          <Modal.Title>{this.props.title ? this.props.title : "Confirm Action"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.props.message ? this.props.message : "Are you sure?"}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Cancel</Button>
          <Button bsStyle="primary" onClick={this.handleConfirm}>Confirm</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default ConfirmModal