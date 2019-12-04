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
        "Category": "typeahead",
        "Name": "typeahead",
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
        "Category": "Select existing or enter new category...",
        "Name": "(Specify category first...)"
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
              nameField.set("placeholder", "Select existing or enter new name...")
            }
            else {
              nameField.set("disabled", true)
              nameField.set("placeholder", "(Specify category first...)")
            }
          },
        },
        "Name": {
          onChange: (e) => {
            console.log("the val", e.value)
          },
        },
      },
      extra: {
        Category: [],
        Name: []
      }
    }

    this.fieldInfo.extra.Category =
      sortBy(this.stackStore.Items, c => c.Title)
      .map(c => ({ Text: c.Title, Value: c.Title }))

  }
}

export default TechnologyForm