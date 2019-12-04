import React from 'react'
import { observer } from 'mobx-react'
import { ControlLabel, FormGroup, FormControl } from 'react-bootstrap'
import FieldRequiredIndicator from './FieldRequiredIndicator'

export default observer(({ field }) => (
  <FormGroup>
    {field.label && <ControlLabel>{field.label} <FieldRequiredIndicator field={field} /></ControlLabel>}
    <FormControl componentClass="select" {...field.bind()}>
      <option value="">Select...</option>
      {
        field.extra.map((option, index) => {
          return (
            <option key={index} value={option.Value}>
              {option.Text}
            </option>
          )
        })
      }
    </FormControl>
    <span className="validation-error">{field.error}</span>
  </FormGroup>
))