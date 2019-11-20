import React from 'react'

export default (({ value }) => {
  return (
    <span className="format-currency">
      {value &&
        new Intl.NumberFormat('en-US', {
          style: 'currency', currency: 'USD'
        }).format(value)
      }
    </span>
  )
})