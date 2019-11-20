import React from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import { Grid, Row, Col, Panel, Button } from 'react-bootstrap'

class Dashboard extends React.Component {

  componentDidMount() {
  }

  render() {
    return (
      <Grid fluid>

        <Row>
          <Col md={4}>
            <Panel>
              <Panel.Heading>Users</Panel.Heading>
              <Panel.Body>
                <p>View / Add / Edit users within the system.</p>
                <Link to="/settings/users/" className="btn btn-primary">Manage</Link>{' '}
                <Link to="/settings/users/new" className="btn btn-default">New User</Link>
              </Panel.Body>
            </Panel>
          </Col>
          <Col md={4}>
            <Panel>
              <Panel.Heading>Logo &amp; Colours</Panel.Heading>
              <Panel.Body>
                <p>Upload logo and match colours to your organisation.</p>
                <Link to="/settings/theme/" className="btn btn-primary">Edit</Link>
              </Panel.Body>
            </Panel>
          </Col>          
          <Col md={4}>
            <Panel>
              <Panel.Heading>External Identity Provider</Panel.Heading>
              <Panel.Body>
                <p>Identity provider integration.</p>
                <Link to="/settings/external-identity/" className="btn btn-primary">Manage</Link>
              </Panel.Body>
            </Panel>
          </Col>
        </Row>
      </Grid>
    )
  }

}

export default inject("AdminAppUserStore", "Settings")(observer(Dashboard))