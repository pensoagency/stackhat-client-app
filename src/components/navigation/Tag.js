import React from 'react'
import Icon from 'react-fontawesome'

function Tag({ text, icon, title }) {
  return (
    <span className="tag" title={title}>
      <Icon name={icon} /> {text}
    </span>
  )
}

export default Tag