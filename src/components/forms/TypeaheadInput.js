import React from 'react'
import { observer } from 'mobx-react';
import { ControlLabel, FormGroup, HelpBlock, Label } from 'react-bootstrap'
import { Typeahead, Highlighter } from 'react-bootstrap-typeahead'
import FieldRequiredIndicator from './FieldRequiredIndicator'

class TypeaheadInput extends React.Component {

  render() {
    let { field, minLength, searchKey, labelKey } = this.props

    return (
      <FormGroup>
        {field.label && <ControlLabel>{field.label} <FieldRequiredIndicator field={field} /></ControlLabel>}

        <Typeahead
          disabled={field.disabled}
          options={field.extra}
          allowNew={true}
          newSelectionPrefix={`Add new ${field.name}:`}
          labelKey="Text"
          placeholder={field.placeholder ? field.placeholder : "Start typing..."}
          ref={(typeahead) => this.typeahead = typeahead}
          renderMenuItemChildren={(option, props) => {
            return (
              <Highlighter search={props.text} key={option.Value}>{option.Text}</Highlighter>
            )
          }}
          onChange={(selected) => {
            if (selected && selected.length > 0) {
              if (selected[0].customOption) {
                field.onChange(selected[0].Text)
              } else
                field.onChange(selected[0].Value)
            }
          }}
        />
        <span className="validation-error">{field.error}</span>
      </FormGroup>
    )
  }
}

export default observer(TypeaheadInput)