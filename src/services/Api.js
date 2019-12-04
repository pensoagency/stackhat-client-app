import Config from 'react-global-configuration'
import Axios from 'axios'
import AxiosResource from './AxiosResource'
import AuthenticationStore from '../stores/AuthenticationStore'
import Notify from './Notify'
import FileDownload from 'js-file-download'
import Version from './Version'

// handle 401 unauth
Axios.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response && error.response.status === 401) {
    // unauth -> redirect login
    AuthenticationStore.RedirectLogin("unauth")
    return Promise.reject(error)
  }
  if (error.response && error.response.status === 400) {
    return Promise.reject(error)
  }
  return error;
})

class Api {

  constructor() {

    let serviceBase = Config.get("apiServiceBaseUri")
    let clientBase = Config.get("clientBaseUri")

    let bigLimit = 100000

    // auth
    let getSecurityHeader = () => ({ Authorization: "Bearer " + AuthenticationStore.Principal.token })
    this.Authentication = {
      login(type, credentials) {
        let config = { crossDomain: true, headers: { 'content-type': 'application/x-www-form-urlencoded' } }
        // switch (type) {
          // case "password":
            return Axios.post(`${serviceBase}token`, `username=${credentials.userName}&password=${credentials.password}`, config)
          // case "id_token":
          //   return Axios.post(`${serviceBase}token`, `grant_type=id_token&id_token=${credentials.id_token}`, config)
        // }
      },
      forgotPassword(userName) { return Axios.post(`${serviceBase}account/forgotpassword`, { UserName: userName }); },
      externalInfo() { return Axios.get(`${serviceBase}api/AuthInstance`, { headers: getSecurityHeader() }) },
      versionCheck() { 
        return Axios.get(`${clientBase}version.json`)
          .then((resp) => { 
            let newVersionAvailable = resp.data.version !== Version
            if (newVersionAvailable)
              console.log("[APP]", `New version available ${resp.data.version}`)
            return newVersionAvailable
          })
          .catch(() => false)
      },
    }

    // entities
    this.Audits = new AxiosResource({ url: `${serviceBase}audits`, params: { } })
    this.Audits.Download = (id) => {
      Axios.get(`${serviceBase}audits/${id}/download`, { responseType: "blob", headers: getSecurityHeader() })
        .then((response) => {
          FileDownload(response.data, `audit-${id}.xlsx`)
        })
    }

    this.Technologies = new AxiosResource({ url: `${serviceBase}technologies`, params: { } })    
    this.Categories = new AxiosResource({ url: `${serviceBase}categories`, params: { } })    

    // cancel token
    this.GetCancelToken = () => {
      return Axios.CancelToken.source()
    }
    this.IsCancel = err => {
      return Axios.isCancel(err)
    }

  }
}

export default new Api()