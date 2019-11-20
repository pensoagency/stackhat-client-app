import React from 'react'
import { Switch, Redirect, Route } from 'react-router-dom'

import Content from '../../components/Content'
import { SubNavArea, SubNav, NavLinkItem } from '../../components/navigation'

import Details from './Details'
import Password from './Password'
import Preferences from './Preferences'

const Account = ({ match, location }) => {

  return (
    <div className="account">
      <SubNavArea>
        <SubNav>
          <NavLinkItem to="/account/details/" text="Personal Details" icon="user" />
          <NavLinkItem to="/account/password/" text="Change Password" icon="key" />
          <NavLinkItem to="/account/preferences/" text="Preferences" icon="user-check" />
        </SubNav>
      </SubNavArea>
      <Content>
        <Switch>
          <Redirect exact from={`${match.url}`} to={`${match.url}/details/`} />
          <Route exact path='/account/details/' component={Details} />
          <Route exact path='/account/password/' component={Password} />
          <Route exact path='/account/preferences/' component={Preferences} />
        </Switch>
      </Content>
    </div>
  )
}

export default Account