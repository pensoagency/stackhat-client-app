import { decorate, observable, action, runInAction } from 'mobx'
import LocalStorage from 'local-storage'
import Config from 'react-global-configuration'

import Api from '../services/Api'
import Notify from '../services/Notify'

import ClientSettingStore from './ClientSettingStore'

let auth = Config.get("auth")

class AuthenticationStore {

  IsAuthenticated = false
  Principal = getPrincipal()
  Settings = new ClientSettingStore()

  Initialise() {
    let authData = getLocalStorage()

    if (auth.fakeAuth) {
      authData = getPrincipal({ userName: "Developer" }, {
        access_token: "fake",
        userId: "fake",
        firstName: "Paul",
        lastName: "Stephenson",
      })
    }

    return new Promise((resolve, reject) => {

      if (authData) {
        if (authData.isAuth) {
          runInAction(() => {
            this.IsAuthenticated = true
            this.Principal = authData
          })
          resolve()

          // this.Settings.Load(this.Principal.userId, this.Principal.organisation)
          //   .then(() => {
          //     resolve()
          //   }).catch((err) => {
          //     this.SignOut(() => {
          //       resolve()
          //     })
          //   })

        } else {
          runInAction(() => {
            this.IsAuthenticated = false
          })
          resolve()
        }
      } else {
        resolve()
      }
    })
  }

  ForgotPassword(userName) {
    return Api.Authentication.forgotPassword(userName)
  }

  Authenticate({ type, credentials, success, error }) {

    return Api.Authentication.login(type, credentials)
      .then((response, e) => {

        // set principal
        runInAction(() => {
          this.Principal = getPrincipal({ userName: credentials.userName }, response.data);
        })

        // set local storage 
        setLocalStorage(this.Principal)

        // load settings
        this.Settings.Load(this.Principal.userId, this.Principal.organisation)
          .then(() => {

            // flag authed
            runInAction(() => {
              this.IsAuthenticated = true
            })

            // call back 
            if (success) {
              setTimeout(success(response), 0);
            }

          }).catch((err) => {
            // sign out
            this.SignOut();

            // call back 
            if (error) {
              setTimeout(error(err.response.data), 0);
            }
          });

      }).catch((err) => {

        // sign out
        this.SignOut();

        let message = err.response ? err.response.data : ("Unable to contact server." + ((type !== "id_token") ? " Please try again." : ""))

        // call back 
        if (error) {
          setTimeout(error(message), 0);
        }

      });

  }

  SignOut(cb) {
    clearLocalStorage()

    // not authed
    runInAction(() => {
      this.IsAuthenticated = false
      this.Principal = getPrincipal()
    })

    // clear settings
    this.Settings.Reset()

    // call back 
    setTimeout(cb, 0)
  }

  RedirectLogin(reason) {
    this.SignOut()
    location.href = `/?reason=${reason}`    
  }

  IsInRole(name) {
    return this.Principal.roles.indexOf(name.toLowerCase()) > -1
    console.log(this.Principal.roles)
  }

  IsUser(id) {
    if (!id) return false   
    return this.Principal.userId === id
  }

}

function getPrincipal(loginData, response) {
  if (!loginData) {
    return {
      token: "",
      userName: "",
      userId: "",
      firstName: "",
      lastName: "",
    }
  } else {
    let result = {
      isAuth: true,
      token: response.access_token,
      userName: loginData.userName,
      userId: response.userId,
      firstName: response.firstName,
      lastName: response.lastName,
    }
    console.log("[AUTH][GP]", result)  
    return result      
  }
}
function getLocalStorage() {
  let result = LocalStorage.get('PrincipalData')
  if (result)
    console.log("[AUTH][LS]", result)    
  return result
}
function setLocalStorage(data) {
  LocalStorage.set('PrincipalData', data)
}
function clearLocalStorage() {
  LocalStorage.remove('PrincipalData')
}

decorate(AuthenticationStore, {
  IsAuthenticated: observable,
  Principal: observable,
  Authenticate: action,
  SignOut: action,
  Initialise: action
})

export default new AuthenticationStore()