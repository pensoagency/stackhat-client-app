import React from 'react'
import { observer } from 'mobx-react'
import { find, extend, sortBy, filter } from 'lodash'
import DropDown from './DropDown'
import { Input, DatePicker, Number, TextArea } from './'

class TemplateFieldsEditor extends React.Component {

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
        {this.renderTemplateFields(field)}
      </div>
    )
  }

  renderTemplateFields(field) {
    let option = field.value
 console.log(option[field.extra.fields])
    if (option) {
      return sortBy(option[field.extra.fields], (f) => f.TemplateField.DisplayOrder).map((sourceField, index) => {
        let createField = (data) => this.props.form.$("Fields").add(data)
        let data = { label: sourceField.TemplateField.Title, key: `${field.extra.keyPrefix}${sourceField[field.extra.fieldIdName]}`, value: sourceField.ValueDate ? sourceField.ValueDate : sourceField.Value  }

        switch (sourceField.TemplateField.Field.Type) {
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
            throw Error(`Unknown template field type '${sourceField.TemplateField.Field.Type}'.`)
        }
      })
    } else {
      return (null)
    }
  }
}

export default observer(TemplateFieldsEditor)