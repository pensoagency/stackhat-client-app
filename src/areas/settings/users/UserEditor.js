import React from 'react'
import { observer, inject } from 'mobx-react'
import { Button, Checkbox } from 'react-bootstrap'
import ItemEditor from '../../../components/lists/ItemEditorNeo'
import Icon from 'react-fontawesome'
import { some, extend } from 'lodash'
import { InlineMultiOrganisationUnitPicker } from '../../../components/forms'
import { ItemEditorSection, ItemDataDisplay } from '../../../components/lists'
import Api from '../../../services/Api'
import Notify from '../../../services/Notify'

const _adminRoleId = "2C289893-E1E6-41AD-89BC-8631D9277CCC"
const _orgAdminRoleId = "52F4624E-A94B-4B01-AAEA-53CC9D5C1E73"

class UserEditor extends React.Component {

  state = {
    showPrintModal: false,
    roles: {
      [_adminRoleId]: false,
      [_orgAdminRoleId]: false
    }
  }

  componentDidMount() {
    this.refresh()
  }

  handleUpdate = (data) => {
    return this.props.AdminAppUserStore.Update(this.props.id, data, { extendSelected: true })
      .then(() => {
        this.refresh()
      })
  }

  handleToggleRole = (roleId) => {
    let userId = this.props.AdminAppUserStore.Selected.AppUserID
    let current = this.state.roles[roleId]
    if (current)
      Api.AppUserRoles.RemoveUserFromRole(roleId, userId).then(() => this.refresh())
    else
      Api.AppUserRoles.AddUserToRole(roleId, userId).then(() => this.refresh())
  }

  handleSendPassword = () => {
    if (confirm("Send user choose / reset password email?")) {
      Api.Authentication.forgotPassword(this.props.AdminAppUserStore.Selected.UserName).then(() => {
        Notify.info("Choose / reset password email sent.");
      })
    }
  }

  refresh = () => {
    this.props.AdminAppUserStore.SelectById(this.props.id, true)
      .then(() => {
        let sel = this.props.AdminAppUserStore.Selected
        this.setState({
          roles: {
            [_adminRoleId]: some(sel.AppRoles, { AppRoleID: _adminRoleId }),
            [_orgAdminRoleId]: some(sel.AppRoles, { AppRoleID: _orgAdminRoleId }),
          }
        }, () => console.log(this.state.roles))
      })
  }

  render() {

    let item = this.props.AdminAppUserStore.Selected

    let { Settings, AdminAppUserStore } = this.props
    let Admin = this.state.roles[_adminRoleId]
    let OrgAdmin = this.state.roles[_orgAdminRoleId]
    let edit = !item.IsExternal

    if (!item)
      return (null)

    return (
      <div>
        <ItemEditor typeTitle={item.IsExternal ? "External User" : "Local User"}
          store={AdminAppUserStore}
          propNames={{ title: (n) => `${n.FirstName} ${n.LastName}` }}
          id={this.props.id}
          functions={{ remove: true, print: false, download: false }}
          edit={false}
          onAfterUpdate={this.reloadListStore}
          iconName="id-card">
          {!item.IsExternal &&
            <div>
              <ItemEditorSection>
                <Button onClick={this.handleSendPassword}><Icon name="envelope" /> Send Choose / Reset Password Email</Button>
              </ItemEditorSection>
              <hr />
            </div>
          }
          {item.IsExternal &&
            <div>
              <ItemEditorSection>
                <p><Icon name="passport" /> This user was created through an external identity provider integration, and editing is limited.</p>
                <p>Note: Changes made may be overwritten using their identity provider profile upon the user logging in.</p>
              </ItemEditorSection>
              <hr />
            </div>
          }
          <ItemEditorSection>
            <ItemDataDisplay type="String" icon="signature" title="First Name" value={item.FirstName} editConfig={edit ? this.getFieldEditConfig("FirstName") : null} />
            <ItemDataDisplay type="String" icon="signature" title="Last Name" value={item.LastName} editConfig={edit ? this.getFieldEditConfig("LastName") : null} />
            {!item.IsExternal && <ItemDataDisplay type="String" icon="at" title="Email" value={item.UserName} editConfig={edit ? this.getFieldEditConfig("UserName") : null} />}
            {item.IsExternal && <ItemDataDisplay type="String" icon="at" title="Email" value={item.Email} />}
            <ItemDataDisplay type="Person" icon="user" title="Associated Researcher" value={item.Person}
              editConfig={
                this.getFieldEditConfig("item",
                  (data) => this.handleUpdate({ PersonID: data.item.PersonID }).catch(err => Notify.info("Researcher is already associated with another user.")),
                  {
                    clearButton: true,
                    clearButtonText: "Unlink this reseacher"
                  })}
            />
          </ItemEditorSection>
          <hr />
          <ItemEditorSection>
            <ItemDataDisplay type="OrganisationUnit" icon="building" title="Organisation Unit" value={item.OrganisationUnit}
              editConfig={
                this.getFieldEditConfig("item",
                  (data) => this.handleUpdate({ OrganisationUnitID: data.item.OrganisationUnitID }),
                  {
                    clearButton: true,
                    clearButtonText: "Unlink this organisation unit"                    
                  })}
            />
            <ItemDataDisplay type="String" icon="shapes" title="Position" value={item.Position} editConfig={this.getFieldEditConfig("Position")} />
          </ItemEditorSection>
          <hr />
          <ItemEditorSection>
            <h4>Advanced Roles</h4>
            <Checkbox checked={this.state.roles[_adminRoleId]} onChange={() => this.handleToggleRole(_adminRoleId)}>
              <strong>Administrator</strong><br />
              <em>View, edit and approve all engagement &amp; impact records within the organisation.</em>
            </Checkbox>
            <Checkbox checked={this.state.roles[_orgAdminRoleId]} onChange={() => this.handleToggleRole(_orgAdminRoleId)}>
              <strong>Organisation Administrator</strong><br />
              <em>Manage user access and system preferences.</em>
            </Checkbox>
          </ItemEditorSection>
          {Admin && <hr />}
          {Admin &&
            <ItemEditorSection>
              <h4>Administrator &gt; AOU Access</h4>
              <p>By default Administator role users have access to records for all AOU's. To configure specific Administrator AOU access specify the AOU's here.
                Note if AOU restrictions are added here, this does not include the Administrator's primary AOU configured above. If they need access to
              this AOU you must also select it here. If no AOU's are selected, the Administrator will have access to all AOU's.</p>
              <br />
              <InlineMultiOrganisationUnitPicker id={item.AppUserID} editable={true} store={AdminAppUserStore} />
            </ItemEditorSection>}
        </ItemEditor>
      </div>
    )

  }

  getFieldEditConfig(propName, updateHandler, otherProps) {
    let config = {
      change: updateHandler ? updateHandler : (data) => this.handleUpdate(data),
      propName: propName
    }
    if (otherProps)
      extend(config, otherProps)
    return config
  }
}

export default inject("Authentication", "AdminAppUserStore", "Settings")(observer(UserEditor))