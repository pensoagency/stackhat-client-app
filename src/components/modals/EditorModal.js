import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import ModalFormField from './ModalFormField'

class EditorModal extends React.Component {

  constructor(props) {
    super(props)

    this.form = props.form
  }

  render() {

    return (
      <form>
        <Modal show={true} onHide={this.props.onHide}>
          <Modal.Header>
            <Modal.Title>{this.form.Title ? this.form.Title : "Editor"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.renderFields()}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.onHide}>Cancel</Button>
            <Button bsStyle="primary" onClick={this.form.onSubmit}>Save</Button>
          </Modal.Footer>
        </Modal>
      </form>
    )
  }

  renderFields() {
    let fields = []
    this.form.fields.forEach((field) =>
      fields.push(field))

    return this.renderFieldsArray(fields)
  }

  renderFieldsArray(fields) {
    return fields.map((field, index) => this.renderField(field, index))
  }

  renderField(field, key) {
    return (
      <ModalFormField key={key} field={field} />
    )
  }

}

export default EditorModal