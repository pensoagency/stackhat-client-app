import React from 'react'
import { observer, inject } from "mobx-react"
import { FormGroup, ControlLabel, Label } from 'react-bootstrap'
import { AsyncTypeahead, Highlighter } from 'react-bootstrap-typeahead'
import Api from '../../services/Api'
import FieldRequiredIndicator from './FieldRequiredIndicator'

class IndustryOrganisationPicker extends React.Component {

  state = {
    options: [],
    isLoading: false
  }

  handleSearch = (query) => {
    this.state.isLoading = true
    Api.IndustryOrganisationNames.query({}, { api_limit: 10, api_search_Name: query })
      .then((response) => {
        this.setState({
          isLoading: false,
          options: response,
        })
      })
  }

  render() {

    let field = this.props.field

    return (
      <FormGroup>
        {field.label && <ControlLabel>{field.label} <FieldRequiredIndicator field={field} /></ControlLabel>}
        {!field.value && <AsyncTypeahead
          {...this.state}
          {...field.bind()}
          allowNew={false}
          newSelectionPrefix="+ Add New:"
          labelKey="Name"
          minLength={3}
          onSearch={this.handleSearch}
          placeholder="Start typing organisation name..."
          ref={(typeahead) => this.typeahead = typeahead}
          renderMenuItemChildren={(option, props) => (
            <Highlighter search={props.text} key={option.IndustryOrganisationID}>{option.Name}</Highlighter>
          )}
          onChange={(selected) => {
            var typeahead = this.typeahead
            if (selected && selected.length > 0) {
              let sel = selected[0]
              if (sel.customOption && this.props.createNew) {
                
                // create new org now?
                if (confirm(`Create new organisation '${sel.Name}'?`)) {
                  Api.IndustryOrganisations.create({
                    Name: sel.Name,
                    OrganisationID: this.props.Authentication.Principal.organisation,
                    Code: ""
                  }).then((newOrg) => {
                    field.value = newOrg
                  })
                }

                typeahead.getInstance().clear()                                  
              } else {
                field.value = selected[0]
                typeahead.getInstance().clear()
              }
            }
          }}
          onBlur={(e) => {
            this.typeahead.getInstance().clear()
          }}
        />}
        {field.value && field.value.IndustryOrganisationID && this.renderSelected(field)}
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

export default inject("Authentication")(observer(IndustryOrganisationPicker))