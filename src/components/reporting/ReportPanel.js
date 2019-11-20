import React from 'react'
import { extend } from 'lodash'
import { observer, inject } from 'mobx-react'
import { decorate, observable, runInAction } from 'mobx'
import ReactResizeDetector from 'react-resize-detector'
import { Panel, DropdownButton, MenuItem } from 'react-bootstrap'
import NewId from '../../utils/NewId'
import Api from '../../services/Api'
import { PanelHeadingFunctions, PanelHeadingButton } from '../panels'
import ReportImage from './ReportImage'
import { Printer, NoPrint } from '../print'

class ReportPanel extends React.Component {

  size = { width: 0 }
  isLoading = true
  chart = null
  errors = null

  componentDidMount() {

    // get unique id
    this.printUid = NewId()

    if (this.props.uid) {
      Api.Reports.query({}, { UniqueID: this.props.uid })
        .then((response) => {
          runInAction(() => {
            this.chart = response[0]
            this.isLoading = false
          })
        }).catch(() => runInAction(() => {
          this.isLoading = false
          this.errors = [{ Message: "Unable to load report." }]          
        }))
    }
  }

  onResize = (width, height) => {
    runInAction(() => { this.size.width = Math.floor(width - 20) })
  }

  handleDownload = () => {
    Api.ReportDownload(this.props.uid,
      768, 1024,
      extend(this.props.filterState.Filters, {}))
  }

  handleReportSelect = (key) => {
    if (this.props.userPreferenceKey) {
      this.props.Settings.SetUserSetting(this.props.userPreferenceKey, key) // set settings 
    }
    if (this.props.onReportSelect) {
      this.props.onReportSelect(key)
    }
  }

  render() {
    return (
      <Panel className="report-panel" id={this.printUid}>
        <Panel.Heading title={this.isLoading ? "Loading..." : (this.chart ? this.chart.Name : "Error - Report Missing")}>
          {this.isLoading ? "Loading..." : this.renderReportDropdown()}
          <PanelHeadingFunctions>
            {/* <PanelHeadingButton title="Print" onClick={() => Notify.info("Printing not currently implemented.")} icon="print" /> */}
            <PanelHeadingButton title="Print" icon="print" onClick={() => Printer.print(this.printUid)} />
            <PanelHeadingButton title="Download" onClick={this.handleDownload} icon="download" />
          </PanelHeadingFunctions>
        </Panel.Heading>
        <Panel.Body>
          <h1 className="pr">{this.chart && this.chart.Name}</h1>
          {!this.errors && this.size.width > 0 && <ReportImage {...this.props} size={this.size} parentLoading={this.isLoading || this.props.isLoading} />}
          {this.errors && this.errors.map((err) => <p>{err.Message}</p>)}
          <ReactResizeDetector handleWidth handleHeight onResize={this.onResize} refreshMode="debounce" refreshRate={500} />
        </Panel.Body>
      </Panel>
    )
  }

  renderReportDropdown() {
    if (this.props.reportItemStore.Items) {
      return (
        <NoPrint>
          <DropdownButton className="report-select" title={this.chart ? this.chart.Name : "Error - Report Missing"} onSelect={this.handleReportSelect} bsStyle="link" id={`select-report-${this.props.userPreferenceKey}`}>
            {this.props.reportItemStore.Items.map((report) => (<MenuItem
              key={report.UniqueID}
              eventKey={report.UniqueID}
              active={report.UniqueID === this.props.uid}>{report.Name}</MenuItem>))}
          </DropdownButton >
        </NoPrint>
      )
    } else {
      return this.chart.Name
    }
  }
}

decorate(ReportPanel, {
  chart: observable,
  isLoading: observable,
  size: observable,
  errors: observable
})

export default inject("Settings")(observer(ReportPanel))