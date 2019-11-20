import React from 'react'
import { observer } from 'mobx-react'

export default observer(({ field }) => {
  if (field.rules && field.rules.split("|").indexOf("required") > -1) {
    return (
      <span className="field-required-indicator">*</span>
    )
  } else {
    return (null)    
  }
})