import dvr from 'mobx-react-form/lib/validators/DVR'
import ValidatorJS from 'validatorjs'
import { compact } from 'lodash'
import Api from '../../services/Api'

class AuditForm {

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
          console.log(data, compact(data.Urls.split("\n")), { name: data.Name, urls: [...compact(data.Urls.split("\n"))] })

          // send audit request to API
          Api.Audits.create({ name: data.Name, urls: [...compact(data.Urls.split("\n"))] })
            .then(result => this.onSuccess(result))

        }
      }
    }

    this.fieldInfo = {
      fields: [
        "Name",
        "Urls",
      ],
      labels: {
        "Name": "Audit name",
        "Urls": "List of website URLs",
      },
      types: {
        "Name": "text",
        "Urls": "textarea",
      },
      values: {
      },
      rules: {
        "Name": "required|string",
        "Urls": "required",
      },
      placeholders: {
        "Name": "Enter a descriptive name for the audit...",
        "Urls": "One URL per line..."
      },
      extra: {
      }
    }

  }
}

export default AuditForm