import React from "react"
import { ControlLabel, FormGroup, HelpBlock } from "react-bootstrap"
import Moment from 'moment'
import ReactDatePicker from "react-16-bootstrap-date-picker"
import FieldRequiredIndicator from './FieldRequiredIndicator'

class DatePicker extends React.Component {

  render() {
    let { field } = this.props

    return (
      <FormGroup className="datepicker">
        {field.label && <ControlLabel>{field.label} <FieldRequiredIndicator field={field} /></ControlLabel>}
        <ReactDatePicker dateFormat="DD/MM/YYYY" {...field.bind({ value: typeof field.value === "object" ? Moment(field.value).format("YYYY-MM-DD") : (field.value === "" ? undefined : field.value), change: (e) => field.onChange(e) })} showTodayButton={true} />
        <span className="validation-error">{field.error}</span>
      </FormGroup>
    )
  }
}

export default DatePicker