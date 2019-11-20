import React from 'react';

class HelpArea extends React.Component {
  render() {
    return (
      <div className="help-area">
        {this.props.children}
      </div>
    )
  }
}

export default HelpArea