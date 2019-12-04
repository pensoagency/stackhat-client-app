import dvr from 'mobx-react-form/lib/validators/DVR'
import ValidatorJS from 'validatorjs'
import { find, sortBy } from 'lodash'
import Api from '../../../services/Api'

class TechnologyForm {

  constructor(stackStore, onSuccess) {
    this.stackStore = stackStore
    this.onSuccess = onSuccess
    this.init()
  }

  init() {
    this.formInfo = {
      plugins: {
        dvr: dvr(ValidatorJS)
      },
      hooks: {
        onSuccess: (form) => {

          let data = form.values()

          // send request to API
          Api.Technologies.create({ category: data.Category, name: data.Name, technology: data.BuiltWithName })
            .then(result => this.onSuccess(result))

        }
      }
    }

    this.fieldInfo = {
      fields: [
        "BuiltWithName",
        "Category",
        "Name",
      ],
      labels: {
        "BuiltWithName": "BuiltWith Name",
        "Category": "Category",
        "Name": "PENSO Name",
      },
      types: {
        "BuiltWithName": "text",
        "Category": "dropdown",
        "Name": "dropdown2",
      },
      values: {
      },
      disabled: {
        "Name": true
      },
      rules: {
        "BuiltWithName": "required|string",
        "Category": "required",
        "Name": "required",
      },
      placeholders: {
        "Name": "(Select category first)"
      },
      hooks: {
        "Category": {
          onChange: (e) => {
            let nameField = e.container().$("Name")
            nameField.clear()            
            if (e.value) {
              let cat = find(this.stackStore.Items, { Title: e.value })
              nameField.set("extra", [...sortBy(cat.Names, n => n.Title).map(n => ({ Text: n.Title, Value: n.Title }))])
              nameField.set("disabled", false)
              nameField.set("placeholder", "Select...")
            }
            else {
              nameField.set("extra", [])
              nameField.set("disabled", true)
              nameField.set("placeholder", "(Select a Category)")
            }
          },
        }
      },
      extra: {
        "Category": {
          options: [],
          display: "Title",
          value: "Title"
        },
        Name: [],
      }
    }

    this.fieldInfo.extra.Category.options =
      this.stackStore.Items.map(c => ({ Title: c.Title }))

  }
}

export default TechnologyForm