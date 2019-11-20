import { FormatForCode } from '../../../components/formatting'
import ValidatorJS from 'validatorjs'
import dvr from 'mobx-react-form/lib/validators/DVR'

const DetailsForm = {

  plugins: { dvr: dvr(ValidatorJS) },
  fields: [
    "FirstName",
    "LastName",
    "Position",
    "PhoneMobile",
    "Email",
  ],
  labels: {
    "FirstName": "First Name",
    "LastName": "Last Name",
    "Position": "Position Title",
    "PhoneMobile": "Mobile Phone",
    "Email": "Email",
  },
  placeholders: {
    "FirstName": "Enter your first name",
    "LastName": "Enter your last name",
    "Position": "Enter your title",
    "PhoneMobile": "Enter your mobile phone",
    "Email": "Enter your email",
  },
  rules: {
    "FirstName": "required",
    "LastName": "required",
    "Email": "required",
  },
  types: {
    "FirstName": "text",
    "LastName": "text",
    "Position": "text",
    "PhoneMobile": "text",
    "Email": "text",
  },
  values: {
    "FirstName": "",
    "LastName": "",
    "Position": "",
    "PhoneMobile": "",
    "Email": "",
  },
  extra: {
  }
}

export default DetailsForm