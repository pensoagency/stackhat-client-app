import React from 'react'
import { ControlLabel, FormGroup, FormControl, Checkbox, HelpBlock } from 'react-bootstrap'
import { observer } from 'mobx-react'
import FieldRequiredIndicator from '../forms/FieldRequiredIndicator'
import Api from '../../services/Api'
import { CheckBoxes } from '../forms'

class ModalFormField extends React.Component {

  state = {
    options: [],
    isLoading: true
  }

  isAsyncLoad = false

  componentDidMount() {
    let { field } = this.props

    // select with async load
    if ((field.type === "select" || field.type == "checkboxes") && field.extra.source === "api") {
      // flag as async
      this.IsAsyncLoad = true

      // load options
      Api[field.extra.set].query(null, field.extra.setParams)
        .then((response) => {
          if (field.type === "select")
            this.setState({ options: [{ text: field.placeholder || "Select...", value: "" }, ...response.map((r) => field.extra.itemMap(r))], isLoading: false })
          else if (field.type === "checkboxes") {
            this.setState({ options: [...response.map((r) => field.extra.itemMap(r))], isLoading: false })          }
        })

    } else {
      this.setState({ isLoading: false })
    }

  }

  render() {
    let { id, field, help } = this.props
    let { isLoading } = this.state
    let hasLabel = field.type !== "checkbox"

    if (isLoading)
      return (null)

    return (
      <FormGroup controlId={id}>
        {field.label && hasLabel && <ControlLabel>{field.label} <FieldRequiredIndicator field={field} /></ControlLabel>}

        {/* render basic inputs */}
        {["input", "textarea"].indexOf(field.type) > -1 && this.renderInput(field)}

        {/* render selects */}
        {field.type === "select" && this.renderSelect(field)}

        {/* render checkbox */}
        {field.type === "checkbox" && this.renderCheckbox(field)}

        {/* render checkboxes */}
        {field.type === "checkboxes" && this.renderCheckboxes(field)}

        <span className="validation-error">{field.error}</span>
        {/* {field && field.error && <p className="error">{field.error}</p>} */}
        {help && <HelpBlock>{help}</HelpBlock>}
      </FormGroup>
    )
  }

  renderInput(field) {
    return <FormControl {...field.bind()} componentClass={field.type} />
  }

  renderSelect(field) {
    let { isLoading } = this.state

    return (
      <FormControl {...field.bind()} componentClass={field.type}>
        {this.isAsyncLoad && isLoading && <option>Loading...</option>}
        {
          this.state.options.length && this.state.options.map((option, key) => <option key={key} value={option.value}>{option.text}</option>)
        }
      </FormControl>
    )
  }

  renderCheckbox(field) {
    return <Checkbox {...field.bind()}>{field.label}</Checkbox>
  }

  renderCheckboxes(field) {
    if (this.state.isLoading)
      return (null)

    return <CheckBoxes field={field} options={this.state.options} />
  }
}

export default observer(ModalFormField)