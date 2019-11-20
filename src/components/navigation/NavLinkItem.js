import React from 'react'
import { NavLink } from 'react-router-dom'
import { NavItem, Glyphicon } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

function NavLinkItem({ to, text, external, icon, iconSize, title }) {
  let iconItem = icon ? <FontAwesome name={icon} size={iconSize || "lg"} /> : null
  
  return external ? (<li className="navlink"><a href={to} title={title} target="_blank">{iconItem} {text}</a></li>)
      : (<NavItem componentClass={NavLink} className="navlink" href={to} to={to} title={title}>{iconItem} {text}</NavItem>)

}

export default NavLinkItem