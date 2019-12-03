import { configure, action, observable, flow, decorate, runInAction } from 'mobx'
import { extend } from 'lodash'
import Notify from '../services/Notify'
import Api from '../services/Api'

// configure({ enforceActions: "observed" })

class ClientSettingStore {

  IsLoading = true
  UserID = null
  OrganisationID = null

  org = {}
  user = {}
  help = {}

  Reset() {
    this.UserID = null
    runInAction(() => {
      this.org = {}
      this.user = {}
      this.help = {}
    })
  }

  Load = async (userId, organisationId) => {
    this.UserID = userId
    this.OrganisationID = organisationId
    this.SetLoading(true)
    const response = await Api.ClientSettings.get()
    runInAction(() => {
      this.org = response.data.org
      this.user = response.data.user
      this.help = response.data.help
    })
    this.SetLoading(false)
  }

  SetLoading(val) {
    runInAction(() => {
      this.IsLoading = val
    })
  }

  SetHelp(key, data) {
    let help = this.help[key]
    let op = null
    this.SetLoading(true)
    if (help.OrganisationID == null) {
      let newHelp = extend({}, help, data)
      delete newHelp.HelpID
      op = Api.Helps.create(newHelp)
    } else {
      op = Api.Helps.update(data, help.HelpID)
    }
    op.then((item) => {
      runInAction(() => {
        extend(this.help[key], item)
      })
      this.SetLoading(false)
    }).catch(() => this.SetLoading(false))
  }
  ResetHelpDefault(key) {
    let help = this.help[key]
    if (help.OrganisationID != null) {
      this.SetLoading(true)
      Api.Helps.delete(help.HelpID)
        .then(() => {
          Api.Helps.query(null, { Key: key })
            .then((response) => {
              runInAction(() => {
                if (response.length > 0) {
                  extend(this.help[key], response[0])
                }
              })
              this.SetLoading(false)
            })
        }).catch(() => this.SetLoading(false))
    }
  }

  ResetTheme() {
    Api.OrganisationSettings.deleteMany({ "Key_StartsWith": "theme_", "Key_NotEqual": "theme_org_logo", OrganisationID: this.OrganisationID })
      .then(() => {
        this.Load(this.UserID, this.OrganisationID)
      })
  }

  SetOrgSetting(key, value) {
    this._setClientSetting("org", key, value)
    this._setServerSetting("Organisation", key, value)
  }

  SetUserSetting(key, value) {
    this._setClientSetting("user", key, value)
    this._setServerSetting("User", key, value)
  }

  _setServerSetting(set, key, value) {
    let idName = `${set}SettingID`
    let setName = `${set}Settings`
    let data = set === "User" ? { Key: key, UserID: this.UserID } : { Key: key, OrganisationID: this.OrganisationID }

    // update server preference
    Api[setName].query({}, data)
      .then((response) => {
        let notifyUpdated = () => (Notify.success("Preference updated."))
        if (response.length > 0) {
          // existing pref
          Api[setName].update({
            Key: key,
            Value: value
          }, response[0][idName]).then(() => {
            notifyUpdated()
          })
        } else {
          // new pref
          Api[setName].create({
            Key: key,
            Value: value
          })
            .then(() => {
              notifyUpdated()
            })
        }
      })
  }

  _setClientSetting(prop, key, value) {
    let setValue = value
    if (["True", "False"].indexOf(setValue) > -1)
      setValue = setValue === "True"
    runInAction(() => {
      this[prop][key] = setValue
    })
  }

}

decorate(ClientSettingStore, {
  org: observable,
  user: observable,
  help: observable,
  IsLoading: observable
})

export default ClientSettingStore