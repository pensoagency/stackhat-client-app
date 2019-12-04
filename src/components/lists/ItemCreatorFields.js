import React from 'react'
import { observer } from 'mobx-react'
import { FormControl } from 'react-bootstrap'

import {
  Input,
  DropDown,
  DropDown2,  
  DatePicker,
  TagsInput,
  OrganisationPicker,
  OrganisationUnitPicker,
  PersonPicker,
  IndustryOrganisationPicker,
  TextArea,
  TemplateFields,
  TemplateFieldsListing,
  TemplateFieldsEditor,
  Number,
  Evidence,
} from '../forms'
import ModalFormField from '../modals/ModalFormField'

class ItemCreatorFields extends React.Component {

  render() {
    let { form, fields, groups } = this.props

    if (groups && groups.length) {
      return this.renderGroups(groups, fields, form)
    } else {
      return this.renderFields(fields, form)
    }

  }

  renderGroups = (groups, fields, form) => {
    return groups.map((group, index) => {
      if (group.heading) {
        return <div key={`group${index}`}>
          <h4 key={`group_heading${index}`}>{group.heading}</h4>
          {this.renderFields(group.fields, form)}
        </div>
      } else {
        return this.renderFields(group.fields, form)
      }
    })
  }

  renderFields(fields, form) {
    return fields.map((fieldName) => {
      if (fieldName.indexOf("[]") > -1) {
        return
      }
      let field = form.$(fieldName)

      switch (field.type) {
        case "datepicker":
          return (<DatePicker key={field.name} field={field} />)
        case "tagsinput":
          return (<TagsInput key={field.name} field={field} {...field.extra} />)
        case "dropdown":
          return (<DropDown key={field.name} field={field} />)
          case "dropdown2":
            return (<DropDown2 key={field.name} field={field} />)          
        case "select":
        case "checkboxes":
          return (<ModalFormField key={field.name} field={field} />)
        case "textarea":
          return (<TextArea key={field.name} field={field} />)
        case "number":
          return (<Number key={field.name} field={field} />)
        case "hidden":
          return (<FormControl key={field.name} {...field.bind()} />)
        default:
          return (<Input key={field.name} field={field} />)
      }
    })
  }

}

export default observer(ItemCreatorFields)