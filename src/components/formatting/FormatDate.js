import React from 'react'

export default (({ value }) => {
  try {
    return (
      <span className="format-date">
        {value &&
          new Intl.DateTimeFormat('en-GB', {
            year: 'numeric',
            month: 'long',
            day: '2-digit'
          }).format(value)
        }
      </span>
    )
  } catch (ex) {
    return <span>Data invalid.</span>
  }
})