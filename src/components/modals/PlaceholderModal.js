import React from 'react'
import { Modal, Button } from 'react-bootstrap'

class PlaceholderModal extends React.Component {

  handleConfirm = () => {
    this.props.onConfirm()
  }

  render() {

    return (
      <Modal show={true} onHide={this.props.onHide}>
        <Modal.Header>
          <Modal.Title>{this.props.title ? this.props.title : "Editor"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Form currently unavailable.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Cancel</Button>
          <Button bsStyle="primary" onClick={this.handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default PlaceholderModal