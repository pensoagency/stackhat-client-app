import React from 'react'

class FormatForCode {

  TrimCode(value) {
    if (value.length !== 6)
      return value

    return (
      value.endsWith("0000") ?
        value.substring(0, 2) : (
          value.endsWith("00") ?
            value.substring(0, 4) : value
        )
    )
  }

}

export default new FormatForCode()