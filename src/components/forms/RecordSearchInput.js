import React from 'react';
import { Button, Row, Col } from 'react-bootstrap'
import { AsyncTypeahead, Highlighter } from 'react-bootstrap-typeahead'
import Icon from 'react-fontawesome'
import Api from '../../services/Api'
import { extend } from 'lodash'

class RecordSearchInput extends React.Component {

  state = {
    isLoading: false
  }
 
  handleSearch = (query) => {
    let config = this.props.config    

    if (this.cancelToken) {
      // cancel any existing request     
      try { this.cancelToken.cancel("Request no longer relevant.") }
      catch (e) { }
    }

    // create new cancel token
    this.cancelToken = Api.GetCancelToken()      

    this.state.isLoading = true
    Api[config.apiSourceSet].query({}, { api_limit: 10, [`api_search_${config.searchKey}`]: query, ...config.apiParams }, this.cancelToken.token)
      .then((response) => {
        this.setState({
          isLoading: false,
          options: response,
        })
      })
  }

  handleSelected = (selected, typeahead) => {
    let config = this.props.config
    let newItem = extend({}, selected)

    // remove any deletes
    if (config.deletes) {
      config.deletes.map((del) => {
        delete newItem[del];
      })
    }    
    // transforms
    if (config.onBeforeCreate) {
      newItem = config.onBeforeCreate(newItem)
    }
    Api[config.apiTargetSet].create(newItem)
      .then((response) => {
        if (response && config.onAfterCreate)
          config.onAfterCreate(response)
      })
    typeahead.getInstance().clear()
  }

  render() {
    let config = this.props.config
    let hasButtons = config.onAddNew || config.onOpenList

    return (
      <div className="record-search-input">
        <div className={hasButtons ? "input-group" : ""}>
        <AsyncTypeahead
          {...this.state}
          allowNew={false}
          labelKey={config.labelResolver}
          minLength={3}
          onSearch={this.handleSearch}
          placeholder={this.props.placeholder || "Search..."}
          emptyLabel="Empty..."
          ref={(typeahead) => this.typeahead = typeahead}
          renderMenuItemChildren={(option, props) => {
            let label = typeof props.labelKey === "function" ? props.labelKey(option) : option[props.labelKey]
            return (<Highlighter search={props.text} key={option.IndustryOrganisationID}>{label}</Highlighter>)
          }}
          onChange={(selected) => {
            this.handleSelected(selected[0], this.typeahead)
          }}
        />
        <div className="input-group-btn">
          {config.onOpenList && <Button title="Open Full List" onClick={config.onOpenList}><Icon name="list" /></Button>}
          {config.onAddNew && <Button title="Add New Item" bsStyle="primary" onClick={config.onAddNew}><Icon name="plus" /> {(config.buttonText && config.buttonText.addNew) ? config.buttonText.addNew : ''}</Button>}          
        </div>
        </div>
      </div>
    )
  }

}

export default RecordSearchInput