import React from 'react';

class SubNavArea extends React.Component {
  render() {
    return (
      <div className="subnav-area pull-left">
        {this.props.children}
      </div>
    )
  }
}

export default SubNavArea