import React from 'react'
import { inject, observer } from 'mobx-react'
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap'
import { debounce } from 'lodash'

class ColourPreference extends React.Component {

  debouncedHandleChange = debounce((value) => {
    this.handleChange(value)
  }, 300)
  handleChange = (value) => {
    let { props } = this
    props.Settings[`Set${props.type.charAt(0).toUpperCase() + props.type.slice(1)}Setting`](props.settingKey, value)
    if (this.props.onChange)
      this.props.onChange(props.settingKey, value)
  }

  render() {
    let { props } = this
    let value = props.Settings[props.type][props.settingKey]

    return (
      <FormGroup className="colour-preference">
        <ControlLabel>{props.title}</ControlLabel>
        <div className="swatch">
          <div className="swatch-input">
            <FormControl componentClass="input" type="color" placeholder={props.placeholder ? props.placeholder : "#"} onChange={(event) => this.debouncedHandleChange(event.target.value)} value={value} />
          </div>
          <div className="swatch-value">{value}</div>
        </div>
      </FormGroup>
    )
  }
}

export default inject("Settings")(observer(ColourPreference))