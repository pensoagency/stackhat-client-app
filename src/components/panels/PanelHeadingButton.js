import React from 'react'
import { Button } from 'react-bootstrap'
import Icon from 'react-fontawesome'

export default (({ title, icon, onClick, customClass }) => (
    <Button bsStyle="link" bsSize="xsmall" title={title} onClick={(event) => { 
      event.stopPropagation()
      if (onClick) onClick(event)
    }} className={customClass}><Icon name={icon} /></Button>
))
