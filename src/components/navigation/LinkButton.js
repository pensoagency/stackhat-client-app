import React from 'react'
import { Link } from 'react-router-dom'
import Icon from 'react-fontawesome'

export default ({ to, text, icon, iconSize, title }) => {
  return (
    <Link to={to} title={title}>{icon && <Icon name={icon} size={iconSize || null} />} {text}</Link>
  )
}