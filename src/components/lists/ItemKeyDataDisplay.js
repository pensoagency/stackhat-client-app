import React from 'react'
import Icon from 'react-fontawesome'
import { FlexibleWidthXYPlot, LineSeries } from 'react-vis';
import { FormatDate, FormatNumber, FormatCurrency } from '../formatting'

class ItemKeyDataDisplay extends React.Component {

  render() {

    return (
      <div className="item-key-data-wrapper">
        <div className="item-key-data">
          <div className="item-key-data__chart">
            <FlexibleWidthXYPlot height={100} margin={5}>
              <LineSeries data={this.props.points} />
            </FlexibleWidthXYPlot>
          </div>
          <div className="item-key-data__icon pull-left">
            <Icon name={this.props.icon} size="2x" />
          </div>
          <div className="item-key-data__body">
            <strong>{this.props.title}</strong><br />
            {this.renderValue(this.props.type, this.props.value)}
          </div>
        </div>
      </div>
    )
  }

  renderValue(type, value) {
    if (!value)
      return (<span>&nbsp;</span>)

    switch (type) {
      case "Date":
        return <FormatDate value={value} />
      case "Number":
        return <FormatNumber value={value} />
      case "Currency":
        return <FormatCurrency value={value} />
      case "List":
        return <ul className="item-data__list">{value.map((v, index) => <li key={index}>{v}</li>)}</ul>
      case "Link":
        return <a href={`http://${value}`} target="_blank">{value}</a>
      case "Address":
        return <a href={`https://maps.google.com/?q=${encodeURIComponent(value)}`} target="_blank">{value}</a>
      default:
        return value
    }
  }
}

export default ItemKeyDataDisplay