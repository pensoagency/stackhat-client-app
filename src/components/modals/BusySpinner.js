import React from 'react'
import LoadingSpinner from "../LoadingSpinner"

export default ({ style, message }) => <div className="modal-busy" style={style}><LoadingSpinner /> {message}</div>