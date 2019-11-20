import React from 'react'
import Icon from 'react-fontawesome'

class DataTable extends React.Component {

  render() {

    
    return (
      <div className={"item-data" + (this.props.editConfig ? " item-data--editable" : "") + (this.props.isFullWidth ? " item-data--full" : "")} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        <div className="item-data__icon">
          <Icon name={this.props.icon ? this.props.icon : "shapes"} size="2x" />
        </div>
        <div className="item-data__body">
          {this.props.title && <span><strong>{this.props.title}</strong><br /></span>}
          {this.renderValue(this.props.type, this.props.value)}
        </div>
      </div>
    )
  }

}

export default DataTable