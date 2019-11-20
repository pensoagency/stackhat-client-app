import React from "react"
import { observer } from "mobx-react"
import { ControlLabel, FormGroup, HelpBlock } from "react-bootstrap"
import ReactBoostrapSlider from 'react-bootstrap-slider'
import FieldRequiredIndicator from './FieldRequiredIndicator'

export default observer(({ field, min, max }) => (
    <FormGroup className="yearspicker">
      {field.label && <ControlLabel>{field.label} <FieldRequiredIndicator field={field} /></ControlLabel>}
      <div className="pull-right">{field.value[0]} - {field.value[1]}</div>
      <ReactBoostrapSlider range={true} min={min} max={max} value={field.value} slideStop={field.onChange} />
      <span className="validation-error">{field.error}</span>
    </FormGroup>
  )
)