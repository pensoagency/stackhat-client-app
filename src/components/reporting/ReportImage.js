import React from 'react'
import { extend } from 'lodash'
import { observer } from 'mobx-react'
import { decorate, observable, runInAction, observe } from 'mobx'
import Icon from 'react-fontawesome'
import { NoItems } from '../reporting'
import Api from '../../services/Api'
import { BusySpinner } from '../modals';

class ReportImage extends React.Component {

  isLoading = true
  chart = null
  errors = null

  componentDidMount() {
    setTimeout(() => {
      this.getChart(this.props.filterState.Filters)
    }, 500)
    this.gcf = observe(this.props.filterState.Filters, this.getChart)
    this.gcw = observe(this.props.size, this.getChart)
  }

  getChart = () => {
    runInAction(() => {
      this.isLoading = true,
        this.errors = null
    })
    var filterData = extend(this.props.filterState.Filters, {})
    Api.ReportData(this.props.uid, Math.floor(this.props.size.width), Math.floor(this.props.height), filterData)
      .then((response) => {
        runInAction(() => {
          this.isLoading = false
          if (response.status === 200)
            this.chart = response.data
          else
            this.errors = response.response.data.Exceptions
        })
      })
      .catch(err => runInAction(() => {
        this.isLoading = false
        this.errors = [{ Message: "Unable to load report data." }]
      }))
  }

  render() {

    let placeholderStyle = {
      width: '100%',
      height: `${this.props.height}px`,
      lineHeight: `${this.props.height}px`
    }

    return (
      <div>
        {(this.isLoading || this.props.parentLoading) && <div className="text-center" style={placeholderStyle}>
          {/* <Icon name="circle-notch" size="2x" spin /> */}
          <BusySpinner style={placeholderStyle} />
        </div>}
        {!this.isLoading && !this.props.parentLoading && this.chart && this.chart.RecordCount > 0 && <img src={"data:image/jpeg;base64," + this.chart.Image} />}
        {!this.isLoading && !this.props.parentLoading && this.chart && this.chart.RecordCount == 0 && <div className="text-center" style={placeholderStyle}><NoItems /></div>}
        {!this.isLoading && this.errors &&
          <div>
            <p><Icon name="exclamation-circle" size="2x" /></p>
            <p><strong>Error Requesting Chart:</strong></p>
            {this.errors.map((err, ei) => <p key={ei}><em>{err.Message}</em></p>)}
            <p>Please check report configuration.</p>
          </div>
        }
      </div>
    )
  }
}

decorate(ReportImage, {
  chart: observable,
  isLoading: observable,
  errors: observable
})

export default observer(ReportImage)