
class Stores {

  constructor(stores) {
    // master collection
    this.All = stores
    // map to properties
    stores.map((s) => this[s.name] = s.store)
  }

  Reset() {
    // reset all stores
    this.All.map((s) => {
      if (!s.store.Reset)
       throw new Error(`${s.name} store does not implement required Reset()`)
      s.store.Reset()
      console.log("[STORES]", "Reset", s.name)
    })
  }

}

export default Stores