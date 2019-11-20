import React from 'react'
import { Panel, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Icon from 'react-fontawesome'
import { observer } from 'mobx-react'
import MobxReactForm from 'mobx-react-form'
import ItemCreatorFields from './ItemCreatorFields'
import { BusySpinner } from '../modals';

class ItemCreator extends React.Component {

  componentWillMount() {
    let propForm = this.props.form
    this.form = new MobxReactForm(propForm.fieldInfo, propForm.formInfo)
  }

  render() {

    let { isBusy, busyMessage } = this.props    

    let placeholderStyle = {
      width: '100%',
      height: `400px`,
      lineHeight: `400px`
    }

    if (this.props.isFrameless) {
      return this.renderForm()
    } else {
      return (
        <Panel>
          <Panel.Heading>Add New {this.props.typeTitle}
            <Button componentClass={Link} className="pull-right" bsStyle="link" bsSize="xs" to="./"><Icon name="times"></Icon></Button>
          </Panel.Heading>
          <Panel.Body>
              {isBusy && <div style={placeholderStyle}><BusySpinner style={placeholderStyle} message={busyMessage} /></div>}
              {!isBusy && this.renderForm()}
          </Panel.Body>
        </Panel>
      )
    }
  }

  renderForm() {
    let { form } = this
    let propForm = this.props.form

    return (<form onSubmit={form.onSubmit} autoComplete="off">

      <ItemCreatorFields form={form} fields={propForm.fieldInfo.fields} />

      {!this.props.isFrameless &&
        <div>
          <hr />
          <Button type="button" onClick={form.onClear}><Icon name="sync" /> Clear</Button>
          <div className="pull-right">
            {this.props.secondarySubmitText && <span><Button onClick={e => form.onSubmit(e, {
              onSuccess: (f) => propForm.formInfo.hooks.onSuccess(f, "secondary")
            })}><Icon name="plus" /> {this.props.secondarySubmitText}</Button>{" "}</span>}
            <Button bsStyle="primary" onClick={form.onSubmit}><Icon name="plus" /> {this.props.submitText ? this.props.submitText : "Create"}</Button>
          </div>
        </div>
      }

      {form.error}

    </form>)
  }

}

export default observer(ItemCreator)