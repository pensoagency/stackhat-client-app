import React from 'react'

export default (({ value }) => {
  return (
    <span className="format-number">
      {value &&
        new Intl.NumberFormat('en-GB', {
          style: 'decimal'
        }).format(value)
      }
    </span>
  )
})