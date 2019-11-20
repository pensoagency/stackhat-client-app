import React from 'react'
import { Switch, Redirect, Route } from 'react-router-dom'

import Content from '../../components/Content'
import { SubNavArea, SubNav } from '../../components/navigation'
import NavLinkItem from '../../components/navigation/NavLinkItem'

import Dashboard from './Dashboard'
import Users from './Users'
import Theme from './Theme'
import ExternalIdentity from './ExternalIdentity'

const Settings = ({ match }) => (

  <div>
    <SubNavArea>
      <SubNav bsStyle="pills" stacked>
        <NavLinkItem to="/settings/dashboard/" text="Dashboard" icon="tachometer-alt" />
        <NavLinkItem to="/settings/users/" text="Users" icon="users" />
        <NavLinkItem to="/settings/theme/" text="Logo &amp; Colours" icon="swatchbook" />
        <NavLinkItem to="/settings/external-identity/" text="External Identity Provider" icon="passport" />
      </SubNav>
    </SubNavArea>

    <Content>
      <Switch>
        <Redirect exact from={`${match.url}`} to={`${match.url}/dashboard/`} />
        <Route exact path='/settings/dashboard/*' component={Dashboard} />
        <Route exact path='/settings/users/' component={Users} />
        <Route exact path='/settings/users/:id' component={Users} />
        <Route exact path='/settings/theme/' component={Theme} />
        <Route exact path='/settings/external-identity/' component={ExternalIdentity} />
      </Switch>
    </Content>
  </div>

)

export default Settings