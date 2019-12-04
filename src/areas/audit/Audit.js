import React from 'react'
import { NavLink } from 'react-router-dom'
import { Grid, Row, Col, Panel, Button, Table } from 'react-bootstrap'
import { observer, inject } from 'mobx-react'
import MobxReactForm from 'mobx-react-form'
import AuditForm from './AuditForm'
import { ItemCreatorFields } from '../../components/lists'

class Audit extends React.Component {

  state = {
    audits: [
      { DatabaseID: "657bdf29-67a8-4cb1-b40f-7b24cf11f38d", Name: "Australian Banking Websites", Created: "2019-11-12 08:00" },
      { DatabaseID: "c1926615-1245-4b56-94e8-776596482324", Name: "State Government Sites", Created: "2019-11-08 16:46" }
    ]
  }

  constructor(props) {
    super(props)
    this.auditForm = new AuditForm(this.handleSuccess)
    this.form = new MobxReactForm(this.auditForm.fieldInfo, this.auditForm.formInfo)
  }

  handleSuccess(data) {

  }

  handleSubmit = (...rest) => {
    this.form.onSubmit(...rest)
  }

  render() {

    return <Grid fluid>
      <Row>
        <Col md={8} sm={12}>
          <form autoComplete="off" onSubmit={this.handleSubmit}>
            <div className="title">
              <h1 className="h2">Create New Audit</h1>
            </div>
            <Panel>
              <Panel.Body>
                <ItemCreatorFields form={this.form} fields={this.auditForm.fieldInfo.fields} />
              </Panel.Body>
            </Panel>
            <Button onClick={this.handleSubmit} bsStyle="primary" className="pull-right">Create Audit</Button>
          </form>
        </Col>
        <Col md={4} sm={12}>
            <div className="title">
              <h1 className="h2">Recent Audits</h1>
            </div>
            <Panel>
              <Panel.Body>
                <Table striped condensed hover>
                  {/* <tr>

                  </tr> */}
                </Table>
              </Panel.Body>
            </Panel>
          </Col>
      </Row>
      {/* <hr />
      <Row>
        <Col md={8} mdOffset={2} sm={12}>
          <div className="title">
            <h1 className="h2">Audit History (Local Storage)</h1>
          </div>
          <Panel>
            <Panel.Body>
              <Table striped condensed hover>
                <thead>
                  <tr>
                    <th></th>
                    <th>Created</th>
                    <th>Name</th>
                    <th>ID</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.audits.map(a =>
                    <tr key={a.DatabaseID}>
                      <td><Button>Download</Button></td>
                      <td>{a.Created}</td>
                      <td>{a.Name}</td>
                      <td>{a.DatabaseID}</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Panel.Body>
          </Panel>
        </Col>
      </Row> */}
    </Grid>
  }

}

export default observer(Audit)
