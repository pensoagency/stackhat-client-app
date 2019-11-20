import React from 'react'
import { observer, inject } from "mobx-react"
import { FormGroup, ControlLabel, Label } from 'react-bootstrap'
import { AsyncTypeahead, Highlighter } from 'react-bootstrap-typeahead'
import Api from '../../services/Api'
import FieldRequiredIndicator from './FieldRequiredIndicator'
import { ErrorBoundary } from '../errors';

class OrganisationPicker extends React.Component {

  state = {
    options: [],
    isLoading: false
  }

  handleSearch = (query) => {
    this.state.isLoading = true
    Api.OrganisationNames.query({}, { api_limit: 10, api_search_Name: query })
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
        {(field.value == null || (field.value != null && !field.value.OrganisationID && !field.value.customOption)) && <AsyncTypeahead
          {...this.state}
          {...field.bind()}
          allowNew={allowNew}
          newSelectionPrefix="+ Add New:"
          labelKey="Name"
          minLength={3}
          onSearch={this.handleSearch}
          placeholder="Start typing organisation name..."
          ref={(typeahead) => this.typeahead = typeahead}
          renderMenuItemChildren={(option, props) => (
            <Highlighter search={props.text} key={option.OrganisationID}>{option.Name}</Highlighter>
          )}
          onChange={(selected) => {
            var typeahead = this.typeahead      
            if (selected && selected.length > 0) {
              let sel = selected[0]
              if (sel.customOption && this.props.createNew) {
                
                // create new org now?
                if (confirm(`Create new organisation '${sel.Name}'?`)) {
                  Api.Organisations.create({
                    Name: sel.Name,
                    UserID: this.props.Authentication.Principal.userId,
                    Code: ""
                  }).then((newOrg) => {
                    field.set(newOrg)
                  })
                }

                typeahead.getInstance().clear()                                  
              } else {
                field.set(selected[0])
                typeahead.getInstance().clear()
              }
            }
          }}
          onBlur={(e) => {
            this.typeahead.getInstance().clear()
          }}
        />}
        {field.value && !field.value.customOption && field.value.OrganisationID !== 0 && this.renderSelected(field)}
        {field.value && field.value.customOption && allowNew && this.renderNew(field)}
        <span className="validation-error">{field.error}</span>
      </FormGroup>
    )

  }

  renderSelected = (field) => {
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

  renderNew = (field) => {
console.log("new", field.value)    
    return (
      <div className="tagsinput__tags">
        <Label className="tagsinput-tag" title={field.value.Name}>
          <a className="pull-right" onClick={() => field.clear()} />
          <span className="tagsinput-tag__text">
            (New Organisation) <em>{field.value.Name}</em>
          </span>
        </Label>
      </div>
    )
  }  

}

export default inject("Authentication")(observer(OrganisationPicker))