import React from 'react'
import { Button } from 'react-bootstrap'
import Icon from 'react-fontawesome'

export default (({ title, icon, onClick }) => (
    <Button bsStyle="link" bsSize="xsmall" title={title} onClick={onClick}><Icon name={icon} /></Button>
))
