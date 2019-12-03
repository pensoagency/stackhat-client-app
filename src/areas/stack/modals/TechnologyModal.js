import React from 'react'
import { observer, inject } from 'mobx-react'
import MobxReactForm from 'mobx-react-form'
import { Modal, Button } from 'react-bootstrap'
import { EditorModal, BusySpinner } from '../../../components/modals'
import { ItemCreatorFields } from '../../../components/lists'
import TechnologyForm from './TechnologyForm'

class TechnologyModal extends EditorModal {

  state = {
    isLoading: true
  }

  componentDidMount() {
    this.editorForm = new TechnologyForm(this.props.onHide)
    this.form = new MobxReactForm(this.editorForm.fieldInfo, this.editorForm.formInfo)

    this.setState({ isLoading: false })
  }

  handleSubmit = (...rest) => {
    this.form.onSubmit(...rest)
  }

  render() {

    let isBusy = this.state.isLoading
    let { onHide } = this.props

    if (!this.form)
      return null

    return (
      <form onSubmit={this.handleSubmit} autoComplete="off">
        <Modal show={true} dialogClassName="modal-90w" onHide={onHide} backdrop="static">
          <Modal.Header>
            <Modal.Title>Add New Technology</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {isBusy && <BusySpinner />}                        
            {!isBusy && <ItemCreatorFields form={this.form} fields={this.editorForm.fieldInfo.fields} />}
          </Modal.Body>
          <Modal.Footer>
            <Button className="pull-left" onClick={onHide}>Cancel</Button>
            <Button bsStyle="primary" disabled={isBusy} onClick={this.handleSubmit}>Create</Button>
          </Modal.Footer>
        </Modal>
      </form>
    )
  }

}

export default TechnologyModal