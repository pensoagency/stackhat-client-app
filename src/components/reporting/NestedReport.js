import React from 'react'
import { observer } from 'mobx-react'
import { decorate, observable, runInAction } from 'mobx'
import ReactResizeDetector from 'react-resize-detector'
import Api from '../../services/Api'
import ReportImage from './ReportImage'

class NestedReport extends React.Component {

  size = { width: 0 }
  isLoading = true
  chart = null

  componentDidMount() {
    Api.Reports.query({}, { UniqueID: this.props.uid })
      .then((response) => {
        runInAction(() => {
          this.chart = response[0]
          this.isLoading = false
        })
      })
  }

  onResize = (width, height) => {
    runInAction(() => { this.size.width = Math.floor(width - 20) })
  }

  render() {

    // missing chart?
    var heading = this.isLoading ? "Loading..." 
      : (this.chart ? this.chart.Name : `Error: Unknown Chart '${this.props.uid}'`)

    return (
      <div className="nested-report">
        <div className="nested-report__heading"><strong>{heading}</strong></div>
        <div className="nested-report__body">
          {this.size.width > 0 && <ReportImage {...this.props} size={this.size} parentLoading={this.isLoading} />}
          <ReactResizeDetector handleWidth handleHeight onResize={this.onResize} refreshMode="debounce" refreshRate={500} />
        </div>
      </div>
    )
  }
}

decorate(NestedReport, {
  chart: observable,
  isLoading: observable,
  size: observable
})

export default observer(NestedReport)