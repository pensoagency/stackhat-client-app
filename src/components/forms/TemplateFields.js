import React from 'react'
import { observer } from 'mobx-react'
import { ControlLabel, FormGroup, FormControl } from 'react-bootstrap'
import { find, extend, sortBy, filter } from 'lodash'
import DropDown from './DropDown'
import { Input, DatePicker, Number, TextArea } from './'
import FieldRequiredIndicator from './FieldRequiredIndicator'

class TemplateFields extends React.Component {

  componentDidMount() {
    if (!this.props.field.extra.keyPrefix) {
      throw "A keyPrefix must be set via extra for TemplateFields fields."
    }      
  }

  handleTemplateChange = (e) => {
    let { field, form } = this.props
    field.set(e.target.value)

    // delete any existing fields
    let templateFields = form.$("Fields")
    if (templateFields.size) {
      for (let i = 0; i < templateFields.size; i++) {
        templateFields.del(`${field.extra.keyPrefix}${i}`)
      }
    }    

  }

  render() {
    let field = this.props.field

    return (
      <div>
        <FormGroup key={field.name}>
          {field.label && <ControlLabel>{field.label} <FieldRequiredIndicator field={field} /></ControlLabel>}
          <FormControl componentClass="select" value={field.value} onChange={this.handleTemplateChange}>
            <option value="">Select...</option>
            {
              field.extra.options.map((option, index) => {
                return (
                  <option key={index} value={option[field.extra.value ? field.extra.value : field.name]}>
                    {(typeof field.extra.display == 'function') ? field.extra.display(option) : option[field.extra.display]}
                  </option>
                )
              })
            }
          </FormControl>
          <span className="validation-error">{field.error}</span>
        </FormGroup>
        {this.renderTemplateFields(field)}
      </div>
    )
  }

  renderTemplateFields(field) {
    var option = find(field.extra.options, { [field.extra.value ? field.extra.value : field.name]: (field.value - 0) })
    if (option) {

      return sortBy(filter(option[field.extra.fields], { IsSelected: true }), (f) => f.DisplayOrder).map((templateField, index) => {
        let createField = (data) => this.props.form.$("Fields").add(data)
        let data = { label: templateField.Title, key: `${field.extra.keyPrefix}${index}` }

        switch (templateField.Field.Type) {
          case "Date":
            return (<DatePicker key={index} field={createField(data)} />)
          case "DropDown":
            return (<DropDown key={index} field={createField(data)} />)
          case "Number":
          case "Funding":
            return (<Number key={index} field={createField(extend(data, { type: "number", value: "" }))} />)
          case "Text":
            return (<TextArea key={index} field={createField(data)} />)
          case "String":
            return (<Input key={index} field={createField(data)} />)
          default:
            throw Error(`Unknown template field type '${templateField.Field.Type}'.`)
        }
      })
    } else {
      return (null)
    }
  }
}

export default observer(TemplateFields)