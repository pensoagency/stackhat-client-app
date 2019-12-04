import React from 'react'
import { Grid, Row, Col, Panel, Table, Button } from 'react-bootstrap'
import { observer, inject } from 'mobx-react'
import { sortBy } from 'lodash'
import { PanelHeadingFunctions, PanelHeadingButton } from '../../components/panels'
import TechnologyModal from './modals/TechnologyModal'
import { BusySpinner } from '../../components/modals'

class Stack extends React.Component {

  state = {
    showAddTechnology: false
  }

  componentDidMount() {
    this.props.StackStore.Load()
  }

  handleToggleExpanded = (cat) => {
    cat.expanded = !cat.expanded
  }

  handleAddNewTechnology = () => {
    this.setState({ showAddTechnology: !this.state.showAddTechnology })
    this.props.StackStore.Load()
  }

  render() {
    let { StackStore } = this.props

    let isBusy = StackStore.IsLoading

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

          {isBusy && <BusySpinner />}
          {!isBusy && StackStore.Items.map((cat, index) =>
            <Panel key={index}>
              <Panel.Heading className="clickable" onClick={() => this.handleToggleExpanded(cat)}>
                <Panel.Title>
                  <PanelHeadingFunctions>
                    <PanelHeadingButton title={cat.expanded ? "Collapse" : "Expand"} icon={cat.expanded ? "minus-square" : "plus-square"} onClick={() => this.handleToggleExpanded(index, cat.expanded)} />
                  </PanelHeadingFunctions>
                  {cat.Title} <em><small>({cat.Names.length})</small></em>
                </Panel.Title>
              </Panel.Heading>
              {cat.expanded && <Panel.Body>
                <Table striped condensed hover className="stack-names">
                  <thead>
                    <tr>
                      <th className="name">Name</th>
                      <th className="technologies"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortBy(cat.Names, n => n.Title).map((name, nameIndex) =>
                      <tr key={nameIndex}>
                        <td><strong>{name.Title}</strong></td>
                        <td className="text-right">
                          <small>
                          {sortBy(name.Technologies).map((tech, techIndex) => {
                            return <span key={techIndex}>{techIndex > 0 ? ", " : ""}{tech}</span>
                          })}
                          </small>
                        </td>
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

export default inject("StackStore")(observer(Stack))
