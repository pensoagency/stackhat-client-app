import React from 'react'
import { Grid, Row, Col, Panel } from 'react-bootstrap'
import Api from '../../services/Api'
import { ItemDataDisplay } from '../../components/lists'

class ExternalIdentity extends React.Component {

  state = {
    info: null
  }

  componentDidMount() {
    Api.Authentication.externalInfo()
      .then(resp => this.setState({ info: resp.data }))
  }

  render() {
    let { info } = this.state

    return (
      <Grid fluid>
        <Row>
          <Col md={12}>
            <Panel>
              <Panel.Heading>External Identity Provider</Panel.Heading>
              <Panel.Body>
                {info && 
                  <div>
                    <p>An external provider is configured for your organisation.</p>                    
                    <ItemDataDisplay type="String" icon="server" title="Instance" value={info.instance} isFullWidth={true} />
                    <ItemDataDisplay type="String" icon="university" title="Issuer" value={info.issuer} isFullWidth={true} />                    
                    <ItemDataDisplay type="String" icon="layer-group" title="Client" value={info.client} isFullWidth={true} />           
                    <ItemDataDisplay type="String" icon="address-book" title="Tenant" value={info.tenant} isFullWidth={true} />
                    <ItemDataDisplay type="String" icon="cogs" title="Configuration Discovery" value={info.metadataUrl} isFullWidth={true} />
                  </div>
                }
                {!info &&
                  <div className="text-center">
                    <p>No external identity provider is configured for your organisation.</p>
                    <p>Please contact support for integration assistance.</p>
                  </div>
                }
              </Panel.Body>
            </Panel>
          </Col>
        </Row>
      </Grid>
    )
  }

}

export default ExternalIdentity