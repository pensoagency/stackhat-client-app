import React from 'react'
import { observer } from 'mobx-react';
import { ControlLabel, FormGroup, HelpBlock, Label } from 'react-bootstrap'
import { Typeahead, AsyncTypeahead, Highlighter } from 'react-bootstrap-typeahead'
import Api from '../../services/Api'
import FieldRequiredIndicator from './FieldRequiredIndicator'

class TagsInput extends React.Component {

  state = {
    options: [],
    isLoading: false
  }

  handleSearch = (query) => {
    let { apiSet, searchLimit, searchKey, labelKey, apiParams } = this.props

    if (this.cancelToken) {
      // cancel any existing request     
      try { this.cancelToken.cancel("Request no longer relevant.") }
      catch (e) {}
    }

    // create new cancel token
    this.cancelToken = Api.GetCancelToken()

    this.setState({ isLoading: true }, () => {
      Api[apiSet].query({}, { api_limit: searchLimit ? searchLimit : 10, [`api_search_${searchKey ? searchKey : labelKey}`]: query, ...apiParams }, this.cancelToken.token)
        .then((response) => {
          this.setState({
            isLoading: false,
            options: response,
          })
        })
    })
  }

  removeTag(index) {
    var newValues = [...this.props.field.value]
    var removing = newValues[index]
    newValues.splice(index, 1)
    this.props.field.set([...newValues])
    if (this.props.onRemoveTag) {
      this.props.onRemoveTag(this.props.field, removing)
    }
  }

  render() {
    let { field, minLength, searchKey, labelKey } = this.props

    return (
      <FormGroup className={"tagsinput" + (this.props.isCompact ? " tagsinput--compact" : "")}>
        {field.label && <ControlLabel>{field.label} <FieldRequiredIndicator field={field} /></ControlLabel>}

        <AsyncTypeahead
          disabled={field.disabled}
          options={this.state.options}
          isLoading={this.state.isLoading}
          allowNew={false}
          labelKey={this.props.labelKey}
          minLength={minLength ? minLength : 2}
          onSearch={this.handleSearch}
          placeholder={this.props.placeholder || field.placeholder || "Start typing..."}
          ref={(typeahead) => this.typeahead = typeahead}
          renderMenuItemChildren={(option, props) => {
            return (
              <Highlighter search={props.text} key={option[props.idKey]}>{typeof props.labelKey === "function" ? props.labelKey(option) : option[props.labelKey]}</Highlighter>
            )
          }}
          onChange={(selected) => {
            if (selected && selected.length > 0) {
              field.value = [...field.value, selected[0]]
              if (this.props.onAddTag) {
                this.props.onAddTag(field, selected[0])
              }
              this.typeahead.getInstance().clear()
            }
          }}
        />
        {!this.props.hideTags &&
        <div className="tagsinput__tags">
          {this.renderTags()}
        </div>
        }
        <span className="validation-error">{field.error}</span>
      </FormGroup>
    )
  }

  renderTags() {
    return this.props.field.value.map((value, index) => {
      return (
        <Label key={value[this.props.idKey]} className="tagsinput-tag" title={this.props.selectedTitleResolver ? this.props.selectedTitleResolver(value) : null}>
          <a className="pull-right" onClick={() => this.removeTag(index)} />
          <span className="tagsinput-tag__text">
            {this.props.selectedLabelResolver ? this.props.selectedLabelResolver(value) : value[this.props.labelKey]}
          </span>
        </Label>
      )
    })
  }
}

export default observer(TagsInput)