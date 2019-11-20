import React from 'react'
import { observer } from 'mobx-react'
import { find, extend, sortBy, filter } from 'lodash'
import DropDown from './DropDown'
import { Input, DatePicker, Number, TextArea } from './'

class TemplateFields extends React.Component {

  render() {
    var field = this.props.field

    return (
      <div>
        <DropDown key={field.name} field={field} />
        {this.renderTemplateFields(field)}
      </div>
    )
  }

  renderTemplateFields(field) {
    var option = find(field.extra.options, { [field.extra.value ? field.extra.value : field.name]: (field.value - 0) })
    if (option) {
      return (<div><label>Fields</label><ul>{sortBy(filter(option[field.extra.fields], { IsSelected: true }), (f) => f.DisplayOrder).map((templateField, index) => {
        let createField = (data) => this.props.form.$("Fields").add(data)
        let data = { label: templateField.Title, rules: "required" }

        return (<li key={index}>{data.label}</li>)

        // switch (templateField.Field.Type) {
        //   case "Date":
        //     return (<DatePicker key={index} field={createField(data)} />)
        //   case "DropDown":
        //     return (<DropDown key={index} field={createField(data)} />)
        //   case "Number":
        //   case "Funding":
        //     return (<Number key={index} field={createField(extend(data, { type: "number", value: "" }))} />)
        //   case "Text":
        //     return (<TextArea key={index} field={createField(data)} />)            
        //   case "String":
        //     return (<Input key={index} field={createField(data)} />)
        //   default:
        //     throw Error(`Unknown template field type '${templateField.Field.Type}'.`)
        // }
      }
      )}</ul></div>)
    } else {
      return (null)
    }
  }
}

export default observer(TemplateFields)