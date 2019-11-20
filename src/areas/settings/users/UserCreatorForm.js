import { FormatForCode } from '../../../components/formatting'
import dvr from 'mobx-react-form/lib/validators/DVR'
import ValidatorJS from 'validatorjs'

class UserCreatorForm {

  constructor(settings, store, onSuccess) {
    this.settings = settings.org
    this.usersettings = settings.user
    this.store = store
    this.onSuccess = onSuccess

    this.init()
  }

  init() {
    let { settings, usersettings } = this

    this.formInfo = {
      plugins: {
        dvr: dvr(ValidatorJS)
      },
      hooks: {
        onSuccess: (form) => {
          let data = form.values()

          this.store.Add({
            FirstName: data.FirstName,
            LastName: data.LastName,
            Email: data.Email,
            UserName: data.Email,
            Position: data.Position,
            PersonID: data.PersonID ? data.PersonID.PersonID : null,
            OrganisationUnitID: data.OrganisationUnitID ? data.OrganisationUnitID.OrganisationUnitID : null
          }).then((newItem) => {
            if (this.onSuccess)
              this.onSuccess(newItem)
          })

        }
      }
    }

    this.fieldInfo = {
      fields: [
        "FirstName",
        "LastName",
        "Email",
        "Position",
        "Roles"
      ],
      labels: {
        "FirstName": "First name",
        "LastName": "Last name",
        "Email": "Email",
        "Position": "Position",
        "Roles": "Advanced Roles"
      },
      types: {
        "FirstName": "text",
        "LastName": "text",
        "Email": "text",
        "Roles": "checkboxes"
      },
      values: {
      },
      rules: {
        "FirstName": "required|string",
        "LastName": "required|string",
        "Email": "required",
      },
      placeholders: {
        "FirstName": "Enter users first name",
        "LastName": "Enter users last name",
        "Email": "Enter users email",
        "Position": "Enter users position",
      },
      extra: {
        //"Roles": { options: [], source: "api", set: "AppRoles", setParams: { api_order: "Title" }, itemMap: (r) => { return { value: r.ImpactID, text: r.Title, checked: !this.isEdit || some(r.Evidences, { "EvidenceID": this.itemId }) } } },              
        "Roles": { options: [], source: "api", set: "AppRoles", setParams: { Name_NotEqual: "SysAdmin" }, itemMap: (r) => { return { value: r.AppRoleID, text: r.FriendlyName, description: r.Description, checked: false } } },
      }
    }
  }
}

export default UserCreatorForm