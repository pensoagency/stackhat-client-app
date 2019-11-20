import React from 'react'
import { Checkbox } from 'react-bootstrap'

class CheckBoxes extends React.Component {

  state = {
    options: []
  }

  componentDidMount() {
    let { field, options } = this.props
    this.setState({ options: [...options] })
    field.set([...options]) // init field value
  }

  handleCheckChange = (field, index) => {
    let options = this.state.options
    options[index].checked = !options[index].checked
    this.setState({ options: [...options] })
    field.set([...options])
  }

  render() {
    let { field } = this.props
    let { options } = this.state

    return <div>
      {!options.length && <span>No items</span>}
      {
        options.map((option, index) =>
          <Checkbox key={index} onChange={(e) => this.handleCheckChange(field, index)} checked={option.checked}>
            <strong>{option.text}</strong>
            {option.description && <em><br />{option.description}</em>}
          </Checkbox>
        )
      }
    </div>
  }
}

export default CheckBoxes