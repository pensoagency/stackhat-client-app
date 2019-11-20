import React from 'react'
import { RIEInput } from 'riek'
import { AsyncTypeahead, Highlighter } from 'react-bootstrap-typeahead'
import Api from '../../services/Api'

export default class InlineOrganisationPicker extends RIEInput {

  state = {
    isLoading: false
  }

  newValue = null

  keyDown = (event) => {
    if (event.keyCode === 27) { this.cancelEditing() }     // Escape
  }

  handleSearch = (query) => {

    if (this.cancelToken) {
      // cancel any existing request     
      try { this.cancelToken.cancel("Request no longer relevant.") }
      catch (e) { }
    }

    // create new cancel token
    this.cancelToken = Api.GetCancelToken()        

    this.state.isLoading = true
    Api.Organisations.query({}, { api_limit: 10, api_search_Name: query }, this.cancelToken.token)
      .then((response) => {
        this.setState({
          isLoading: false,
          options: response,
        })
      })
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

  renderEditingComponent = () => {
    return (
      <span className="inline-editable-wrapper">
        <AsyncTypeahead
          {...this.state}
          allowNew={this.props.allowNew} 
          newSelectionPrefix="+ Add New:"
          labelKey="Name"
          minLength={3}
          onSearch={this.handleSearch}
          placeholder="Start typing organisation name..."
          emptyLabel="Empty..."
          ref={(typeahead) => this.typeahead = typeahead}
          // renderMenuItemChildren={(option, props) => (
          //   <Highlighter search={props.text} key={option.OrganisationID}>{option.Name}</Highlighter>
          // )}
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
    )
  }

  renderNormalComponent = () => {

    return (
      <div className="inline-editable-wrapper" title="Edit">
        <span className="inline-editable">
          <span tabIndex="0"
            className={this.makeClassString()}
            onFocus={this.startEditing}
            onClick={this.startEditing}
            {...this.props.defaultProps}>
            {this.props.value || this.state.newValue ? <span>{this.props.value.Name}</span> : <span>(empty)</span>}
          </span>
        </span>
      </div>
    )

  }
}