import React from 'react';
import { NavLink } from 'react-router-dom'
import { Panel } from 'react-bootstrap'

class PanelLink extends React.Component {
  render() {
    return (
      <NavLink href={this.props.to} to={this.props.to} className={`panel-link ${this.props.active ? "active" : ""} ${this.props.className}`}>
        <Panel>
          <Panel.Body>
            {this.props.children}
          </Panel.Body>
        </Panel>
      </NavLink>
    )
  }
}

export default PanelLink