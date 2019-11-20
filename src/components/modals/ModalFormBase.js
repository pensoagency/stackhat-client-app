import { Form } from 'mobx-react-form'
import dvr from 'mobx-react-form/lib/validators/DVR'
import ValidatorJS from 'validatorjs'

class ModalFormBase extends Form {

  plugins() {
    return {
      dvr: dvr({
        package: ValidatorJS,
        // extend: ({ validator }) => {
        // }
      })
    }
  }

}

export default ModalFormBase