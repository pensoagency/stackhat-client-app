import React from 'react'
import { RIEInput } from 'riek'
import { Label, Button } from 'react-bootstrap'
import { AsyncTypeahead, Highlighter } from 'react-bootstrap-typeahead'
import Icon from 'react-fontawesome'
import { TagList } from '../navigation'
import Api from '../../services/Api'
import Notify from '../../services/Notify'

export default class InlineTagsInput extends RIEInput {

  state = {
    options: [],
    isLoading: false,
    values: null
  }

  constructor(props) {
    super(props)
    this.state.values = this.props.value
  }

  keyDown = (event) => {
    if (event.keyCode === 27) { this.cancelEditing() }     // Escape
  }

  handleSearch = (query) => {
    this.setState({ isLoading: true }, () => {
      let config = this.props.editConfig
      Api[config.apiSet].query({}, { api_limit: config.searchLimit ? config.searchLimit : 10, [(config.searchKeyIsCustom ? "" : "api_search_") + `${config.searchKey ? config.searchKey : config.labelKey}`]: query })
        .then((response) => {
          this.setState({
            isLoading: false,
            options: response,
          })
        })
    })
  }

  removeTag(index) {
    let newValues = [...this.state.values]
    let removing = newValues[index]
    let isValid = true
    if (this.props.editConfig.onValidateRemoveTag) {
      if (!this.props.editConfig.onValidateRemoveTag(removing)) {
        Notify.info("Unable to remove. Associated was created by another user.")
        isValid = false
      }
    }
    if (isValid) {
      newValues.splice(index, 1)
      this.setState({
        values: [...newValues]
      })
      if (this.props.editConfig.onRemoveTag) {
        this.props.editConfig.onRemoveTag(removing)
      }
    }
  }

  finishEditing = () => {
    this.props.editConfig.onBeforeFinish ? this.props.editConfig.onBeforeFinish() : null
    this.cancelEditing()
    this.props.editConfig.onAfterFinish ? this.props.editConfig.onAfterFinish() : null
  }

  renderEditingComponent = () => {
    let config = this.props.editConfig

    return (
      <span className="inline-editable-wrapper inline-tags-input" ref="input">
        <AsyncTypeahead
          disabled={false}
          options={this.state.options}
          isLoading={this.state.isLoading}
          allowNew={false}
          labelKey={config.labelKey}
          minLength={config.minLength ? config.minLength : 2}
          onSearch={this.handleSearch}
          placeholder={config.placeholder || "Start typing..."}
          ref={(typeahead) => this.typeahead = typeahead}
          renderMenuItemChildren={(option, props) => {
            let labelKey = props.labelKey
            return (
              <Highlighter search={props.text} key={option[props.idKey]}>{typeof labelKey === "function" ? labelKey(option) : option[labelKey]}</Highlighter>
            )
          }}
          onChange={(selected) => {
            if (selected && selected.length > 0) {
              if (config.onAddTag) {
                config.onAddTag(selected[0])
                  .then((result) => {
                    if (result) {
                      this.setState({
                        values: [...this.state.values, result]
                      })
                    }
                  })
              } else {
                this.setState({
                  values: [...this.state.values, selected[0]]
                })
              }
              this.typeahead.getInstance().clear()
            }
          }}

        />
        <Button title="Finish Editing" bsStyle="link" onClick={() => this.finishEditing()}><Icon name="times" /></Button>
        <div className="tagsinput__tags">
          {this.renderTags()}
        </div>
      </span>
    )
  }
  renderTags() {
    let val = this.state.values
    return val.map((value, index) => {
      return (
        <Label key={index} className="tagsinput-tag" title={this.props.selectedTitleResolver ? this.props.selectedTitleResolver(value) : null}>
          <a className="pull-right" onClick={() => this.removeTag(index)} />
          <span className="tagsinput-tag__text">
            {this.props.textResolver ? this.props.textResolver(value) : value[this.props.labelKey]}
          </span>
        </Label>
      )
    })
  }

  renderNormalComponent = () => {
    let val = this.state.values
    let editable = this.props.editConfig ? true : false

    return (
      <div className={editable ? "inline-editable-wrapper" : ""} title="Edit"
        onFocus={(e) => (editable ? this.startEditing(e) : null)}
        onClick={(e) => (editable ? this.startEditing(e) : null)}>
        <div className={editable ? "inline-editable" : ""}>
          <div tabIndex="0"
            className={this.makeClassString()}
            {...this.props.defaultProps}>
            {(val && val.length) ?
              <TagList icon={this.props.icon} tags={val} textResolver={this.props.textResolver} titleResolver={this.props.titleResolver} />
              : <TagList icon={this.props.icon} tags={[{ Tag: { Value: this.props.emptyText ? this.props.emptyText : `No items${editable ? ", click to edit" : ""}` } }]} />
            }
          </div>
        </div>
      </div>
    )
  }


}