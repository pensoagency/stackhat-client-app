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
          Api.Technologies.create(data)
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
      rules: {
        "BuiltWithName": "required|string",
        "Category": "required",
        "Name": "required",
      },
      placeholders: {
      },
      hooks: {
        "Category": {
          onChange: (e) => {
              let cat = find(this.stackStore.Items, { Title: e.value })
              let nameField = e.container().$("Name")
              nameField.set("extra", [...sortBy(cat.Names, n => n.Title).map(n => ({ Text: n.Title, Value: n.Title }))])
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