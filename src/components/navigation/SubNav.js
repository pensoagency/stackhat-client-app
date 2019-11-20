import React from 'react';
import { Nav, Panel } from 'react-bootstrap';

class SubNav extends React.Component {
  render() {
    let mode = this.props.mode ? this.props.mode : "vertical"

    return (
      <div className={`subnav subnav-${mode}`}>
        <Panel>
          <Nav bsStyle="pills" stacked={mode == "vertical"}>
            {this.props.children}
          </Nav>
        </Panel>
      </div>
    )
  }
}

export default SubNav