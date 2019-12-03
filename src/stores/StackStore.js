import StoreBase from './StoreBase'
import Api from '../services/Api'
import Notify from '../services/Notify'
import { configure, action, observable, flow, decorate, runInAction } from 'mobx'

// configure({ enforceActions: "observed" })

class StackStore extends StoreBase {

    constructor(auth) {
        super(auth)

        this.Api = Api

        this.Reset()
    }

    Reset() {
        this.Items = []
    }

    Load = () => {
        this.SetLoading(true)

        // cancel
        if (this.LoadCancelToken)
            this.LoadCancelToken.cancel()

        this.LoadCancelToken = this.Api.GetCancelToken()

        return this.Api.Categories.list({}, this.LoadCancelToken.token)
            .then(response => {

                runInAction(() => {
                    if (response) {
                        //this.Total = response.$_total
                        this.Items = response
                    }
                })
                this.SetLoading(false)
            }).catch(error => {
                if (!this.Api.IsCancel(error)) {
                    console.log("[STACKSTORE]", "LOAD", "Error", error)
                    Notify.error("Error. Please try again or contact support.")
                    this.SetLoading(false)
                }
            })
    }

}

decorate(StackStore, {
    Items: observable
})

export default StackStore