import React from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import { Grid, Row, Col, Panel, Button } from 'react-bootstrap'
import Icon from 'react-fontawesome'
import { ColourPreference, ImagePreference } from '../account/shared'

class Theme extends React.Component {

  handleRestoreDefaultColours = () => {
    if (confirm("Restore default colours?"))
      this.props.Settings.ResetTheme()
  }

  render() {
    return (
      <Grid fluid>
        <Row className="show-grid">
          <Col md={12}>
          <Panel>
              <Panel.Heading>Organisation Logo</Panel.Heading>
              <Panel.Body>
                <ImagePreference type="org" settingKey="theme_org_logo" instructions="Logos should be maximum 320px wide by 76px high, and should be no more than 30KB file size." />
              </Panel.Body>
            </Panel>

            <Panel>
              <Panel.Heading>Colours</Panel.Heading>
              <Panel.Body>
                <Row>
                  <Col md={3} sm={6}>
                    <ColourPreference title="Header Background" type="org" settingKey="theme_header_bgcolour" />
                    <ColourPreference title="Footer Background" type="org" settingKey="theme_footer_bgcolour" />
                  </Col>
                  <Col md={3} sm={6}>
                    <ColourPreference title="Header Nav Item Text" type="org" settingKey="theme_header_nav_colour" />
                    <ColourPreference title="Header Nav Item Hover Text" type="org" settingKey="theme_header_nav_hover_colour" />
                    <ColourPreference title="Header Nav Item Active Text" type="org" settingKey="theme_header_nav_active_colour" />
                    <ColourPreference title="Header Nav Item Active Background" type="org" settingKey="theme_header_nav_active_bgcolour" />
                    <ColourPreference title="Header Nav Item Hover Background" type="org" settingKey="theme_header_nav_hover_bgcolour" />
                  </Col>
                  <Col md={3} sm={6}>
                    <ColourPreference title="Subnav Item Text" type="org" settingKey="theme_subnav_colour" />
                    <ColourPreference title="Subnav Item Active Background" type="org" settingKey="theme_subnav_active_bgcolour" />
                  </Col>
                  <Col md={3} sm={6}>
                    <ColourPreference title="Primary Button Background" type="org" settingKey="theme_button_primary_bgcolour" />
                    <ColourPreference title="Primary Button Text" type="org" settingKey="theme_button_primary_colour" />
                    <Button bsStyle="primary"><Icon name="plus" /> Sample Primary Button</Button>
                    <hr />
                    <ColourPreference title="Normal Button Background" type="org" settingKey="theme_button_bgcolour" />
                    <ColourPreference title="Normal Button Text" type="org" settingKey="theme_button_colour" />
                    <Button><Icon name="plus" /> Sample Normal Button</Button>                    
                  </Col>
                </Row>
                <Button onClick={this.handleRestoreDefaultColours}>Restore Default Colours</Button>
              </Panel.Body>
            </Panel>
          </Col>
        </Row>
      </Grid>
    )
  }

}

export default inject("Settings")(observer(Theme))