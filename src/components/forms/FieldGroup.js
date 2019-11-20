import React from 'react'
import { ControlLabel, FormGroup, FormControl, HelpBlock } from 'react-bootstrap'
import FieldRequiredIndicator from './FieldRequiredIndicator'

function FieldGroup({ id, label, help, field, value, ...props }) {
  return (
      <FormGroup controlId={id}>
        {label && <ControlLabel>{label} <FieldRequiredIndicator field={field} /></ControlLabel>}
        <FormControl value={value} {...props} />
        {field && field.error && <p className="error">{field.error}</p>}
        {help && <HelpBlock>{help}</HelpBlock>}
      </FormGroup>
  )
}

export default FieldGroup