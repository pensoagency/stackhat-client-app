import React from 'react'
import { toast } from 'react-toastify'
import { Button } from 'react-bootstrap'

const Notify = {
  success: (msg) => {
    toast.success(msg, { autoClose: 1500 })
  },
  error: (msg) => {
    toast.error(msg, { autoClose: 1500 })
  },
  info: (msg) => {
    toast.info(msg, { autoClose: 1500 })
  },
  newVersionReload: () => {
    toast.error(() => <div className="version-notify">
      <p><strong>A new version is available</strong></p>
      <Button onClick={() => window.location.reload(true)}><strong>Click Here To Reload</strong></Button>
    </div>
      , { autoClose: false })
  },
}

export default Notify