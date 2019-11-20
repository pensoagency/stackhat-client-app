import React from 'react'
import { RIEInput } from 'riek'
import { Button } from 'react-bootstrap'
import Icon from 'react-fontawesome'
import { AsyncTypeahead, Highlighter } from 'react-bootstrap-typeahead'
import Api from '../../services/Api'

export default class InlineOrganisationUnitPicker extends RIEInput {

  state = {
    isLoading: false
  }

  newValue = null

  keyDown = (event) => {
    if (event.keyCode === 27) { this.cancelEditing() }     // Escape
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

  handleClear = () => {
    this.commit({ OrganisationUnitID: null })
  }

  finishEditing = () => {
    this.props.beforeFinish ? this.props.beforeFinish() : null
    let newValue = this.newValue // ReactDOM.findDOMNode(this.refs.input).value;
    const result = this.doValidations(newValue)
    if (result && this.props.value !== newValue) {
      this.commit(newValue)
    }
    if (!result && this.props.handleValidationFail) {
      this.props.handleValidationFail(result, newValue, () => this.cancelEditing())
    } else {
      this.cancelEditing()
    }
    this.props.afterFinish ? this.props.afterFinish() : null
  }

  formatItem = (value) => {
    if (!value) return
    return value.Name
  }

  renderEditingComponent = () => {
    let { value, clearButton, clearButtonText, searchInputPlaceholder } = this.props
    return <div>
      {clearButton && (value || this.state.newValue) &&
        <div>
          <span>{this.formatItem(value)}</span>
          <Button bsStyle="link" onClick={this.handleClear}><Icon name="unlink" /> {clearButtonText ? clearButtonText : "Unlink this organisation unit"}</Button>
        </div>
      }
      <span className="inline-editable-wrapper">
        <AsyncTypeahead
          {...this.state}
          allowNew={this.props.allowNew}
          newSelectionPrefix="+ Add New:"
          labelKey="Name"
          minLength={3}
          onSearch={this.handleSearch}
          placeholder={searchInputPlaceholder ? searchInputPlaceholder : "Start typing organisation unit name..."}
          emptyLabel="Empty..."
          ref={(typeahead) => this.typeahead = typeahead}
          renderMenuItemChildren={(option, props) => <Highlighter search={props.text} key={option.OrganisationUnitID}>{option.Name}</Highlighter>}
          ref="input"
          onChange={(selected) => {
            if (selected && selected.length > 0) {
              this.newValue = selected[0]
              this.finishEditing()
            }
          }}
          onBlur={() => {
            this.cancelEditing()
          }}
        />
      </span>
    </div>
  }

  renderNormalComponent = () => {
    let { value } = this.props
    return <span className="inline-editable-wrapper" title="Edit">
      <span className="inline-editable">
        <span tabIndex="0"
          className={this.makeClassString()}
          onFocus={this.startEditing}
          onClick={this.startEditing}
          {...this.props.defaultProps}>
          {this.props.value || this.state.newValue ? <span>{this.formatItem(value)}</span> : <span>(empty)</span>}
        </span>
      </span>
    </span>
  }

}