import React from 'react'
import { NavLink } from 'react-router-dom'
import { Grid, Row, Col, Panel, Table, Button } from 'react-bootstrap'
import Icon from 'react-fontawesome'
import { observer, inject } from 'mobx-react'
import { PanelHeadingFunctions, PanelHeadingButton } from '../../components/panels'
import TechnologyModal from './modals/TechnologyModal'

class Stack extends React.Component {

  state = {
    showAddTechnology: false,
    categories: [
      { name: "CMS", expanded: false, technologies: [{ name: "SiteCore" }, { name: "Umbraco" }, { name: "WorstPress" }] },
      { name: "CDN", expanded: false, technologies: [{ name: "Cloudflare" }, { name: "Verizon" }, { name: "Akami" }, { name: "Azure CDN" }, { name: "AWS CloudFront" }] },
    ]
  }

  handleToggleExpanded = (index, current) => {
    let stateCopy = Object.assign({}, this.state)
    stateCopy.categories[index].expanded = !current
    this.setState(stateCopy)
  }

  handleAddNewTechnology = () => {
    this.setState({ showAddTechnology: !this.state.showAddTechnology })
  }

  render() {

    return <Grid fluid>
      <Row>
        <Col md={8} mdOffset={2} sm={12}>

          <div className="title">
            <div className="title-buttons">
              <Button disabled>Reorder Categories</Button>
              <Button bsStyle="primary" onClick={this.handleAddNewTechnology}>Add New Technology</Button>
            </div>
            <h1 className="h2">Manage Stack</h1>
          </div>

          {this.state.showAddTechnology && <TechnologyModal onHide={this.handleAddNewTechnology} />}

          {this.state.categories.map((cat, index) =>
            <Panel key={index}>
              <Panel.Heading className="clickable" onClick={() => this.handleToggleExpanded(index, cat.expanded)}>
                <Panel.Title>
                  <PanelHeadingFunctions>
                    <PanelHeadingButton title={cat.expanded ? "Collapse" : "Expand"} icon={cat.expanded ? "minus-square" : "plus-square"} onClick={() => this.handleToggleExpanded(index, cat.expanded)} />
                  </PanelHeadingFunctions>
                  {cat.name} <em><small>({cat.technologies.length})</small></em>
                </Panel.Title>
              </Panel.Heading>
              {cat.expanded && <Panel.Body>
                <Table striped condensed hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cat.technologies.map(a =>
                      <tr key={a.name}>
                        <td>{a.name}</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Panel.Body>}
            </Panel>
          )}

        </Col>
      </Row>
    </Grid>

  }

}

export default observer(Stack)
