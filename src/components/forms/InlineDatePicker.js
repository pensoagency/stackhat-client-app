import React from 'react'
import { RIEInput } from 'riek'
import ReactDatePicker from "react-16-bootstrap-date-picker"
import { FormatDate } from '../formatting'
import Moment from 'moment'

export default class InlineDatePicker extends RIEInput {

  newValue = null

  keyDown = (event) => {
    if (event.keyCode === 27) { this.cancelEditing() }     // Escape
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
        <ReactDatePicker
          dateFormat="DD/MM/YYYY"
          value={new Moment(this.state.newValue ? this.state.newValue : (this.props.value ? this.props.value : new Date())).format("YYYY-MM-DD")}
          disables={this.state.loading}
          className={this.makeClassString()}
          onChange={(val) => {
            this.newValue = new Date(val)
            this.finishEditing()
          }}
          onBlur={() => this.cancelEditing()}
          onKeyDown={this.keyDown}
          ref="input"
          calendarPlacement="bottom"
          autoFocus={true}
          {...this.props.editProps}
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
            {this.props.value || this.state.newValue ? <FormatDate value={this.state.newValue ? this.state.newValue : this.props.value} /> : <span>(empty)</span>}
          </span>
        </span>
      </div>
    )

  }
}