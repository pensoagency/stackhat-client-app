import React from 'react'
import { RIETextArea } from 'riek'

export default ({ value, ...props }) => (
  <span className="inline-editable-wrapper" title="Edit">
    <RIETextArea value={""+value} {...props} className="inline-editable" classEditing="form-control" />
  </span>
)