import dvr from 'mobx-react-form/lib/validators/DVR'
import ValidatorJS from 'validatorjs'
import Api from '../../../services/Api'

class TechnologyForm {

  constructor(onSuccess) {
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
        "Name": "dropdown",
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
      extra: {
        "Category": {
          options: []
        },   
        "Name": {
          options: []
        },        
      }
    }

  }
}

export default TechnologyForm