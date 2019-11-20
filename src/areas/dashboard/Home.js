import React from 'react'
import { NavLink } from 'react-router-dom'
import { Grid, Row, Col } from 'react-bootstrap'
import { observer, inject } from 'mobx-react'

class Home extends React.Component {

  componentDidMount() {
  }

  render() {

    let settings = this.props.Settings

    return (
      <Grid fluid className="dashboard">
      </Grid>
    )
  }

}

export default observer(Home)
