import React from 'react'
import { observer } from 'mobx-react'
import { ControlLabel, FormGroup, FormControl, HelpBlock } from 'react-bootstrap'
import FieldRequiredIndicator from './FieldRequiredIndicator'

export default observer(({ field }) => (
  <FormGroup>
    {field.label && <ControlLabel>{field.label} <FieldRequiredIndicator field={field} /></ControlLabel>}
    <FormControl type="number" {...field.bind() } {...field.extra} />
    <span className="validation-error">{field.error}</span>
  </FormGroup>
))