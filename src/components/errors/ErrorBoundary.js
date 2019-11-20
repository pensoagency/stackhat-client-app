import React from 'react'
import { ErrorContent } from '.'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false }    
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true, error, info })
   
    console.log("[ERRORBOUNDARY]", error, info)
    //// TODO log UI error to service
    //Api.Error(error, info);
  }

  render() {
    let { hasError, error, info } = this.state

    if (hasError) {
      return <ErrorContent detail={{ error, info }} />
    }    
    
    return this.props.children
  }
}

export default ErrorBoundary