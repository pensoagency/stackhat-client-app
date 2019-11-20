import React from 'react'
import Icon from 'react-fontawesome'
import { Link } from 'react-router-dom'
import { Button, Checkbox } from 'react-bootstrap'
import { FormatDate, FormatNumber, FormatCurrency } from '../formatting'

import { InlineInput, InlineTextArea, InlineDatePicker, InlineOrganisationPicker, InlineOrganisationUnitPicker, InlineIndustryOrganisationPicker, InlineAsyncSelect, InlinePersonPicker } from '../forms'

class ItemDataDisplay extends React.Component {

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

  renderValue(type, value) {
    let editConfig = this.props.editConfig

    switch (type) {
      case "Date":
        return editConfig ? <InlineDatePicker value={value ? value : ""} {...editConfig} /> : <FormatDate value={value} />
      case "Number":
        return editConfig ? <InlineInput type="number" value={value ? value : "(empty)"} {...editConfig} /> : (this.props.unformattedNumber ? value : <FormatNumber value={value} />)
      case "Currency":
        return <FormatCurrency value={value} />
      case "List":
        return <div><ul className="item-data__list">{value.map((v, index) => <li key={index}>{v}</li>)}</ul>
          {this.props.editTo && <Link to={this.props.editTo}><Button>Edit</Button></Link>}
        </div>
      case "Link":
        return <a href={`http://${value}`} target="_blank">{value}</a>
      case "RouteLinkButton":
        return <Link to={this.props.to}><Button>{value}</Button></Link>
      case "Address":
        return <a href={`https://maps.google.com/?q=${encodeURIComponent(value)}`} target="_blank">{value}</a>
      case "String":
        return editConfig ? <InlineInput value={value ? value : "(empty)"} {...editConfig} /> : <span>{value}</span>
      case "Text":
        return editConfig ? <InlineTextArea value={value ? value : "(empty)"} {...editConfig} /> : <span>{value}</span>
      case "Organisation":
        return editConfig ? <InlineOrganisationPicker value={value ? value : ""} {...editConfig} /> : <span>{value}</span>
      case "OrganisationUnit":
        return editConfig ? <InlineOrganisationUnitPicker value={value ? value : ""} {...editConfig} /> : <span>{value}</span>
      case "IndustryOrganisation":
        return editConfig ? <InlineIndustryOrganisationPicker value={value ? value : ""} {...editConfig} /> : <span>{value}</span>
      case "Person":
        return editConfig ? <InlinePersonPicker value={value ? value : ""} {...editConfig} /> : <span>{value}</span>
      case "AsyncSelect":
        return editConfig ? <InlineAsyncSelect value={value} {...editConfig} /> : <span>{value}</span>
      case "Boolean":
        return (<div>
          <Checkbox checked={value} disabled={!editConfig}>{this.props.label}</Checkbox>
          {this.props.description && <em>{this.props.description}</em>}
        </div>)
      default:
        return editConfig ? <InlineInput value={value ? value : "(empty)"} {...editConfig} /> : <span>{value}</span>
    }
  }
}

export default ItemDataDisplay