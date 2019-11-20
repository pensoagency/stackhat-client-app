import React from 'react'
import { observer } from "mobx-react"
import { FormGroup, ControlLabel, Label } from 'react-bootstrap'
import { AsyncTypeahead, Highlighter } from 'react-bootstrap-typeahead'
import Api from '../../services/Api'
import FieldRequiredIndicator from './FieldRequiredIndicator'

class OrganisationUnitPicker extends React.Component {

  state = {
    options: [],
    isLoading: false
  }

  handleSearch = (query) => {
    this.state.isLoading = true
    Api.OrganisationUnits.query({}, { api_limit: 10, api_search_Name: query })
      .then((response) => {
        this.setState({
          isLoading: false,
          options: response,
        })
      })
  }

  render() {

    let field = this.props.field
    let allowNew = this.props.allowNew ? this.props.allowNew : (field.extra && field.extra.allowNew)

    return (
      <FormGroup>
        {field.label && <ControlLabel>{field.label} <FieldRequiredIndicator field={field} /></ControlLabel>}
        {!field.value && <AsyncTypeahead
          {...this.state}
          {...field.bind()}
          allowNew={allowNew}
          newSelectionPrefix="+ Add New:"
          labelKey="Name"
          minLength={3}
          onSearch={this.handleSearch}
          placeholder="Start typing organisation unit name..."
          ref={(typeahead) => this.typeahead = typeahead}
          renderMenuItemChildren={(option, props) => <Highlighter search={props.text} key={option.OrganisationUnitID}>{option.Name}</Highlighter>}
          onChange={(selected) => {
            if (selected && selected.length > 0) {
              field.value = selected[0]
              this.typeahead.getInstance().clear()
            }
          }}
          onBlur={(e) => {
            this.typeahead.getInstance().clear()
          }}
        />}
        {field.value && this.renderSelected(field)}
        <span className="validation-error">{field.error}</span>
      </FormGroup>
    )

  }

  renderSelected(field) {
    return (
      <div className="tagsinput__tags">
        <Label className="tagsinput-tag" title={field.value.Name}>
          <a className="pull-right" onClick={() => field.clear()} />
          <span className="tagsinput-tag__text">
            {field.value.Name}
          </span>
        </Label>
      </div>
    )
  }

}

export default observer(OrganisationUnitPicker)