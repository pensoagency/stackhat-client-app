import dvr from 'mobx-react-form/lib/validators/DVR'
import ValidatorJS from 'validatorjs'
import Notify from '../../../services/Notify'

class ChangePasswordForm {

  constructor(appUserStore) {
    this.appUserStore = appUserStore
  }

  formInfo = {
    plugins: {
      dvr: dvr({
        package: ValidatorJS,
        extend: ({ validator }) => {
          validator.registerAsync("validatePassword", (value, attr, key, passes) => {
            this.appUserStore.ValidatePassword(value)
              .then(response => {
                passes()
              })
              .catch(err => {
                passes(false, err.response.data.ModelState["model.Password"].join(" "))
              })
          })
        }
      })
    },
    hooks: {
      onSuccess: (form) => {
        this.appUserStore.ChangePassword(form.$("Password").value, form.$("NewPassword").value, form.$("ConfirmNewPassword").value)
          .then(() => {
            Notify.success("Password updated successfully")
            form.clear()
          })
      }
    }
  }

  fieldInfo = {

    fields: [
      "Password",
      "NewPassword",
      "ConfirmNewPassword",
    ],
    labels: {
      "Password": "Current Password",
      "NewPassword": "New Password",
      "ConfirmNewPassword": "Confirm New Password",
    },
    placeholders: {
      "Password": "Enter your current password",
      "NewPassword": "Enter your new password",
      "ConfirmNewPassword": "Confirm your new password",
    },
    rules: {
      "Password": "required",
      "NewPassword": "validatePassword|required",
      "ConfirmNewPassword": "required|same:NewPassword",
    },
    types: {
      "Password": "password",
      "NewPassword": "password",
      "ConfirmNewPassword": "password",
    },
    extra: {
      "NewPassword": {
        description: "Minimum 8 characters long, 2 letters, 2 digits, 1 upper case, 1 lower case, 1 symbol"
      }
    }
  }

}

export default ChangePasswordForm