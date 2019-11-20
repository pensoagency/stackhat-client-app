import React from 'react'
import { Link } from 'react-router-dom'
import Button from './PanelHeadingButton'

export default (({ to, ...props}) => (
  <Link to={to}><Button {...props} /></Link> 
))