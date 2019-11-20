import React from 'react'
import { NavLink } from 'react-router-dom'
import Icon from 'react-fontawesome'

export default (({ title, icon, to }) => (
  <NavLink to={to} title={title ? title : "Navigate to item"} className="btn btn-xs btn-link"><Icon name={icon} /></NavLink>
))
