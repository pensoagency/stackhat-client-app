import React from 'react'

export default (({ value }) => {
  try {
    return (
      <span className="format-date">
        {value &&
          new Intl.DateTimeFormat('default', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
          }).format(value)
        }
      </span>
    )
  } catch (ex) {
    return <span>Data invalid.</span>
  }
})