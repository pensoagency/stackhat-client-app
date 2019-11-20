import React from 'react'
import { inject, observer } from 'mobx-react'
import { FormGroup, ControlLabel } from 'react-bootstrap'
import Switch from 'react-bootstrap-switch'

class SwitchPreference extends React.Component {

  handleSwitch = (elem, state) => {
    let { props } = this

    // get storable value
    let value = state ? "True" : "False"

    props.Settings[`Set${props.type.charAt(0).toUpperCase() + props.type.slice(1)}Setting`](props.settingKey, value)       
  }

  render() {
    let { props } = this
    let value = props.Settings[props.type][props.settingKey]

    return (
      <FormGroup className="switch-preference">
        <Switch onChange={this.handleSwitch} bsSize="mini" name={props.settingKey} value={value} disabled={props.disabled} />
        <ControlLabel>{props.title}</ControlLabel>        
      </FormGroup>
    )
  }
}

export default inject("Settings")(observer(SwitchPreference))