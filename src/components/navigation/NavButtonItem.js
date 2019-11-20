import React from 'react'
import { Button, NavItem } from 'react-bootstrap'
import Icon from 'react-fontawesome'

export default ({ text, icon, iconSize, title, onClick, className }) => {
  let iconItem = icon ? <Icon name={icon} size={iconSize || "lg"} /> : null
  
  return (<Button componentClass={NavItem} bsStyle="link" className={className} title={title} onClick={onClick}>{iconItem} {text}</Button>)
}