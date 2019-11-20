import React from 'react'
import Icon from 'react-fontawesome'
import { Button } from 'react-bootstrap'

export default ({ type, title, item, onClick, doConfirm, confirmMessage }) => (
  <Button bsStyle="link" title={title} onClick={(e) => {
    if (doConfirm && confirm(`${confirmMessage ? confirmMessage : title + "."} Are you sure?`))
      onClick(e, item)
    else if (!doConfirm)
      onClick(e, item)
    }}><Icon name={type} /></Button>
)