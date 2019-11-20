import React from 'react'
import { inject } from 'mobx-react'
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap'

class SelectPreference extends React.Component {

  handleChange = (event) => {
    let { props } = this
    props.Settings[`Set${props.type.charAt(0).toUpperCase() + props.type.slice(1)}Setting`](props.settingKey, event.target.value)
    if (this.props.onChange)
      this.props.onChange(props.settingKey, event.target.value)
  }

  render() {
    let { props } = this
    let value = props.Settings[props.type][props.settingKey]

    return (
      <FormGroup className="select-preference">
        <ControlLabel>{props.title}</ControlLabel>
        <FormControl componentClass="select" placeholder={props.placeholder ? props.placeholder : "Select..."} onChange={this.handleChange} className="size-2" defaultValue={value}>
          {props.options.map((opt) => {
            return <option key={opt.value} value={opt.value}>{opt.text}</option>
          })}
        </FormControl>
      </FormGroup>
    )
  }
}

export default inject("Settings")(SelectPreference)