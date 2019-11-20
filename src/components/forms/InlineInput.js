import React from 'react'
import { RIEInput } from 'riek'

export default (props) => (
  <span className="inline-editable-wrapper" title="Edit">
    <RIEInput {...props} className="inline-editable" classEditing="form-control" />
  </span>
)