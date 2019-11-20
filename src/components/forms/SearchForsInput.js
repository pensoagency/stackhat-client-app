import React from 'react'
import { FormGroup, Label } from 'react-bootstrap'
import { AsyncTypeahead, Highlighter } from 'react-bootstrap-typeahead'
import Api from '../../services/Api'

class SearchForsInput extends React.Component {

  state = {
    options: [],
    isLoading: false,
    values: []
  }

  handleSearch = (query) => {

    if (this.cancelToken) {
      // cancel any existing request     
      try { this.cancelToken.cancel("Request no longer relevant.") }
      catch (e) { }
    }

    // create new cancel token
    this.cancelToken = Api.GetCancelToken()

    this.setState({ isLoading: true }, () => {
      Api["FORs"].query({}, { api_limit: 99999, api_search_Code_Name: query }, this.cancelToken.token)
        .then((response) => {
          this.setState({
            isLoading: false,
            options: [...response.map(option => ({ ...option, CodeName: `${option.Code} - ${option.Name}`}))],
          })
        })
    })
  }

  removeTag(index) {
    var newValues = [...this.props.field.value]
    var removing = newValues[index]
    newValues.splice(index, 1)
    this.props.field.value = newValues
    if (this.props.onRemoveTag) {
      this.props.onRemoveTag(this.props.field, removing)
    }
  }

  render() {
    let { props, state } = this

    return (
      <FormGroup className="tagsinput">
        <AsyncTypeahead
          options={state.options}
          isLoading={state.isLoading}
          allowNew={false}
          minLength={3}
          labelKey="CodeName"
          onSearch={this.handleSearch}
          placeholder={props.placeholder || "Search research area..."}
          ref={(typeahead) => this.typeahead = typeahead}
          renderMenuItemChildren={(option, props) => <Highlighter search={props.text} key={option.ClassificationID}>{`${option.Code} - ${option.Name}`}</Highlighter>}
          onChange={(selected) => {
            if (selected && selected.length > 0) {
              this.setState({
                values: [...this.state.values, selected[0]]
              })
              if (props.onAddTag) {
                props.onAddTag(selected[0])
              }
              this.typeahead.getInstance().clear()
            }
          }}
        />
        {!props.hideTags &&
          <div className="tagsinput__tags">
            {this.renderTags()}
          </div>
        }
      </FormGroup>
    )
  }

  renderTags() {
    return this.state.values.map((value, index) => {
      return (
        <Label key={value.ClassificationID} className="tagsinput-tag">
          <a className="pull-right" onClick={() => this.removeTag(index)} />
          <span className="tagsinput-tag__text">
            {`${value.Code} - ${value.Name}`}
          </span>
        </Label>
      )
    })
  }
}

export default SearchForsInput