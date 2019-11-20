import React from 'react'

export default (({ ...props }) => (
  <div className="panel-heading__functions">
    {props.children}
  </div>
))
