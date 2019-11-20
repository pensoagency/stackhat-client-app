import React from 'react';

class Content extends React.Component {
  render() {
    return (
      <div className={`content container-fluid ${this.props.full ? "content-full" : ""}`}>
        {this.props.children}
      </div>
    )
  }
}

export default Content