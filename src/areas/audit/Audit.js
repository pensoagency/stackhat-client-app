import React from 'react'
import { NavLink } from 'react-router-dom'
import { Grid, Row, Col, Panel, Button, Table } from 'react-bootstrap'
import { observer, inject } from 'mobx-react'
import MobxReactForm from 'mobx-react-form'
import Icon from 'react-fontawesome'
import AuditForm from './AuditForm'
import { ItemCreatorFields } from '../../components/lists'
import { BusySpinner } from '../../components/modals'

class Audit extends React.Component {

  constructor(props) {
    super(props)
    this.auditForm = new AuditForm(this.handleSuccess)
    this.form = new MobxReactForm(this.auditForm.fieldInfo, this.auditForm.formInfo)
  }

  componentDidMount() {
    this.loadAudits()
  }

  loadAudits = () => {
    this.props.AuditStore.Load()
      .then(_ => setTimeout(this.loadAudits, 10000))
  }

  handleSuccess = (data) => {
    // push to store
    this.props.AuditStore.Items.push(data)
    this.form.clear()
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
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Status</th>
                    <th>&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.AuditStore.Items.map(audit =>
                    <tr key={audit.id}>
                      <td><strong>{audit.title}</strong><br />
                        {audit.urls.map(url => <span><a href={url}>{url}</a><br /></span>)}
                      </td>
                      <td>
                        {!audit.isReady && !audit.isError && <span>Creating audit</span>}
                        {audit.isError && <span>Error occurred</span>}
                        {audit.isReady && <span>Complete</span>}
                      </td>
                      <td>
                      {!audit.isReady && !audit.isError && <span className="list-spinner"><BusySpinner /></span>}
                        {audit.isError && <Icon name="exclamation-triangle" />}
                        {audit.isReady && <a href="#">Download</a>}
                      </td>
                    </tr>
                  )}
                </tbody>
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

export default inject("AuditStore")(observer(Audit))
