import React from 'react'
import { NavLink } from 'react-router-dom'
import { Grid, Row, Col, Panel, Button, Table } from 'react-bootstrap'
import Config from 'react-global-configuration'
import { observer, inject } from 'mobx-react'
import MobxReactForm from 'mobx-react-form'
import { sortBy, take } from 'lodash'
import Icon from 'react-fontawesome'
import AuditForm from './AuditForm'
import { ItemCreatorFields } from '../../components/lists'
import { BusySpinner } from '../../components/modals'
import { FormatDateShort, FormatTime } from '../../components/formatting'
import Api from '../../services/Api'

let serviceBase = Config.get("apiServiceBaseUri")

class Audit extends React.Component {

  state = {
    isSubmitted: false,
    takeCount: 5
  }

  constructor(props) {
    super(props)
    this.auditForm = new AuditForm(this.handleSuccess)
    this.form = new MobxReactForm(this.auditForm.fieldInfo, this.auditForm.formInfo)
  }

  componentDidMount() {
    this.props.AuditStore.Load()
    this.startLoads()
  }
  componentWillUnmount() {
    this.stopLoads()
  }

  startLoads = () => {
    this.loadAuditsTimeout = setTimeout(this.loadAudits, 10000)
  }
  stopLoads = () => {
    this.loadAuditsTimeout = null
  }

  loadAudits = () => {
    this.stopLoads()
    this.props.AuditStore.Load()
      .then(_ => this.startLoads())
  }

  handleSuccess = (data) => {
    // load store
    this.loadAudits()
    this.form.reset()
    this.setState({ isSubmitted: true })
  }

  handleSubmit = (...rest) => {
    this.form.onSubmit(...rest)
  }

  handleDownload = (id) => {
    Api.Audits.Download(id)
  }

  handleToggleLog = (audit) => {
    audit.showLog = !audit.showLog
  }

  render() {
    let { isSubmitted, takeCount } = this.state
    let items = this.props.AuditStore.Items

    return <Grid fluid>
      <Row>
        <Col md={6} sm={12}>
          <form autoComplete="off" onSubmit={this.handleSubmit}>
            <div className="title">
              <h1 className="h2">Create New Audit</h1>
            </div>
            {!isSubmitted && <div>
              <Panel>
                <Panel.Body>
                  <ItemCreatorFields form={this.form} fields={this.auditForm.fieldInfo.fields} />
                </Panel.Body>
              </Panel>
              <Button onClick={this.handleSubmit} bsStyle="primary" className="pull-right">Create Audit</Button>
            </div>}
            {isSubmitted && <div><Panel>
              <Panel.Body>
                <p><strong>Success!</strong></p>
                <p>Your audit is now being generated, please track progress via the Audit History list.</p>
              </Panel.Body>
            </Panel>
              <Button onClick={() => this.setState({ isSubmitted: false })} bsStyle="primary" className="pull-right">Create Another Audit</Button>
            </div>
            }
          </form>
        </Col>
        <Col md={6} sm={12}>
          <div className="title">
            <h1 className="h2">Audit History</h1>
          </div>
          <Panel>
            <Panel.Body>
              <Table striped condensed hover>
                <thead>
                  <tr>
                    <th>Created</th>
                    <th>Title</th>
                    <th>Status</th>
                    <th>&nbsp;</th>
                    <th>&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  {take(sortBy(items, a => new Date(a.created)).reverse(), takeCount).map(audit =>
                    <React.Fragment>
                      <tr key={audit.id}>
                        <td><FormatDateShort value={new Date(audit.created)} /><br /><FormatTime value={new Date(audit.created)} /></td>
                        <td><strong>{audit.title}</strong><br />
                          {audit.urls.map((url, uidx) => <span key={uidx}><a href={url}>{url}</a><br /></span>)}
                        </td>
                        <td>
                          {!audit.isReady && !audit.isError && <span>Creating audit</span>}
                          {audit.isError && <span>Error occurred</span>}
                          {audit.isReady && <span>Complete</span>}
                        </td>
                        <td className="text-right">
                          {!audit.isReady && !audit.isError && <span className="list-spinner"><BusySpinner /></span>}
                          {audit.isError && <Icon name="exclamation-triangle" />}
                          {audit.isReady && <Button bsStyle="small" onClick={() => this.handleDownload(audit.id)}><Icon name="download" /> Download Audit</Button>}
                        </td>
                        <td><Button title="Toggle log" onClick={() => this.handleToggleLog(audit)}><Icon name={audit.showLog ? "angle-double-up" : "angle-double-down"} /></Button></td>
                      </tr>
                      {audit.showLog &&
                        <tr>
                          <td colSpan="5">
                            <ul>
                              {!audit.log.length && <em>Loading...</em>}
                              {audit.log.map(item => <li>{item}</li>)}
                            </ul>
                          </td>
                        </tr>
                      }
                    </React.Fragment>
                  )}
                </tbody>
              </Table>
              {items.length > takeCount && <div className="text-center">
                <Button bsStyle="small" onClick={() => this.setState({ takeCount: takeCount + 10 })}>SHOW MORE</Button>
              </div>}
            </Panel.Body>
          </Panel>
        </Col>
      </Row>
    </Grid>
  }

}

export default inject("AuditStore")(observer(Audit))
