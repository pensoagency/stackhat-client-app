import React from 'react'
import { Row, Col } from 'react-bootstrap'
import Icon from 'react-fontawesome'
import Config from 'react-global-configuration'

const { showDetail } = Config.get("errors")

class ErrorContent extends React.Component {
  render() {
    let { detail } = this.props

    return (
      <div className="error-content">
        <Row>
          <Col md={3}></Col>
          <Col md={6}>
            <h1 className="h3"><Icon name="exclamation-triangle" /> Client Application Error</h1>
            <p>An unhandled exception has occurred in the client application.</p>
            <p>Please try reloading your browser, or if the problem persists please contact application support.</p>
            {showDetail && detail && detail.error && detail.info &&
              <div className="error-detail format-text">
                <h2 className="h4">Exception Detail</h2>
                {detail.error.toString()}<br />
                {detail.info.componentStack}
              </div>
            }
          </Col>
          <Col md={3}></Col>
        </Row>
      </div>
    )
  }
}

export default ErrorContent