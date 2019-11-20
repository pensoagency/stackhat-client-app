import React from 'react'
import { inject, observer } from 'mobx-react'
import { debounce } from 'lodash'
import { Grid, Row, Col, Panel } from 'react-bootstrap'
import Icon from 'react-fontawesome'
import { ItemList } from '../../components/lists'
import { UserCreator, UserEditor } from './users'

class Users extends React.Component {

  sortByOptions = [
    { Name: "Last Name, First Name", Key: "LastName,FirstName" },
    { Name: "First Name, Last Name", Key: "FirstName,LastName" },
    { Name: "Email", Key: "Email" },
    { Name: "Newest", Key: "-Created" },
    { Name: "Oldest", Key: "Created" },    
  ]

  handleSearchChanged = (val) => {
    this.props.AdminAppUserStore.ExtendQuery({ api_search_FirstName_LastName_UserName: val }, true)
    if (!val) {
      this.props.AdminAppUserStore.Load()
    } else {
      this.debouncedSearch()
    }
  }
  debouncedSearch = debounce(() => {
    this.props.AdminAppUserStore.Load()
  }, 300)

  render() {
    let { AdminAppUserStore } = this.props
    let id = this.props.match.params.id
    let isNew = id == "new"

    return (
      <Grid fluid>
        <Row>
          <Col md={id ? 6 : 12}>
            <ItemList store={AdminAppUserStore}
              key="users"
              idName="AppUserID"
              heading="Users"
              scrollToId="users"
              getSearchValue={() => AdminAppUserStore.Query.api_search_FirstName_LastName_UserName}
              onSearchChanged={this.handleSearchChanged}
              searchPlaceholder="Search users..."
              iconName="users"
              navigateToResolver={(item) => `./${item.AppUserID}`}
              renderListItemContent={this.renderListItemContent}
              sortByOptions={this.sortByOptions}
              busyShowTools={true}
              hasNew={true} />
          </Col>
          {id &&
            <Col md={6}>
              {isNew ? <UserCreator /> : <UserEditor key={this.props.match.params.id} id={this.props.match.params.id} />}
            </Col>
          }
        </Row>
      </Grid>
    )
  }

  renderListItemContent = (item) => {
    return (<div>
      <div className="pull-right">
        <Icon name={item.IsExternal ? "passport" : "id-card"} size="2x" />
      </div>
      <h4 className="item-list-item__heading">{item.FirstName} {item.LastName}</h4>
      <div className="item-list-item__details">
        <span className="item-list-item__detail" title="Position"><Icon name="shapes" /> <strong>Position</strong> {item.Position ? ` ${item.Position}` : <em>Unknown</em>}</span>
        <span className="item-list-item__detail" title="Email"><Icon name="at" /> <strong>Email</strong> {item.Email}</span>
        <span className="item-list-item__detail" title="Roles"><Icon name="user-tag" /> <strong>Roles</strong> {item.AppRoles.length ? item.AppRoles.map((r) => r.FriendlyName).join(", ") : "User"}</span>
      </div>
    </div>)
  }

}

export default inject("AdminAppUserStore", "Settings")(observer(Users))