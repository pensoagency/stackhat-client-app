import { configure, observable, decorate, action, runInAction } from 'mobx'

// configure({ enforceActions: "observed" })

class StoreBase {

  IsLoading = false

  SetLoading(val) {
    runInAction(() => {
      this.IsLoading = val
    })
  }

}

decorate(StoreBase, {
  IsLoading: observable
})

export default StoreBase