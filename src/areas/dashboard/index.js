import React from 'react'
import { inject } from 'mobx-react'
import { Switch, Redirect, Route } from 'react-router-dom'

import Content from '../../components/Content'
import { SubNavArea, SubNav } from '../../components/navigation'
import NavLinkItem from '../../components/navigation/NavLinkItem'

import Home from './Home'

const index = ({ match, location, Authentication }) => {

  // determine fallback redirect
  let redirect = `${match.url}/home/`

  return (
    <div className={"activity"}>
      <SubNav mode="horizontal">
        <NavLinkItem to="/dashboard/home/" text="My Dashboard" icon="tachometer-alt" />
      </SubNav>
      <Content full={true}>
        <Switch>
          <Redirect exact from={`${match.url}`} to={redirect} />

          <Route exact path='/dashboard/home/*' component={Home} />
        </Switch>
      </Content>
    </div>
  )
}

export default inject("Authentication")(index)